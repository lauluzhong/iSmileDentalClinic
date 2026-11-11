/* iSmile dashboard — shared behaviour for every page (6 Nov 2026).
   Loaded synchronously in <head> so the theme is set before first paint.
   1. light/dark: remembered per browser; with no stored choice it follows the system setting
   2. the header clock (same on every page)
   3. motion: cards rise in once, a hero figure counts up once
   4. loading: skeleton lines, the other pages fetched ahead of time, data feeds kept ready
   Pages that draw on a canvas listen for the "themechange" event and read colours via ismileTheme.css(). */
(function () {
  var KEY = "ismile-dash-theme", root = document.documentElement;
  var TOP = false; try { TOP = window.top === window; } catch (e) {}
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function system() { try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; } }
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var t = stored();
  root.setAttribute("data-theme", t === "light" || t === "dark" ? t : system());

  /* ================= 4a. data feeds kept ready =================
     Every page reads its numbers from the status feeds. The first read on a page is answered
     from a copy saved in this browser when that copy is under a minute old, so moving between
     pages paints at once; every later read (refreshes, polling after an edit) goes to the network.
     After a page settles, the feeds the other pages need are fetched quietly in the background. */
  var FEEDS = "https://raw.githubusercontent.com/lauluzhong/iSmileDentalClinic/status/";
  var FRESH_MS = 60000, STORE = "ismile-dash-feeds-v1", AT = "x-dash-at";
  var realFetch = window.fetch ? window.fetch.bind(window) : null, firstRead = {};
  function feedKey(u) { return u.split("?")[0]; }
  function openStore() { try { return window.caches ? caches.open(STORE) : Promise.resolve(null); } catch (e) { return Promise.resolve(null); } }
  function saved(key) {
    return openStore().then(function (c) { return c ? c.match(key) : null; }).then(function (r) {
      if (!r) return null;
      var at = +r.headers.get(AT) || 0;
      return Date.now() - at < FRESH_MS ? r : null;
    }).catch(function () { return null; });
  }
  function save(key, res) {
    return res.blob().then(function (b) {
      var copy = new Response(b, { status: 200, headers: { "content-type": "application/json", "x-dash-at": String(Date.now()) } });
      return openStore().then(function (c) { return c ? c.put(key, copy) : null; });
    }).catch(function () {});
  }
  function network(args, key) {
    return realFetch.apply(null, args).then(function (r) { if (r.ok) save(key, r.clone()); return r; });
  }
  if (realFetch) {
    window.fetch = function (input, init) {
      var u = "";
      try { u = typeof input === "string" ? input : (input && input.url) || ""; } catch (e) {}
      var get = !init || !init.method || String(init.method).toUpperCase() === "GET";
      if (!u || u.indexOf(FEEDS) !== 0 || !get) return realFetch.apply(null, arguments);
      var key = feedKey(u), args = arguments;
      if (firstRead[key]) return network(args, key);
      firstRead[key] = 1;
      return saved(key).then(function (hit) { return hit || network(args, key); });
    };
  }
  function warmFeeds() {
    if (!realFetch || !TOP) return;
    ["deck", "hq", "cashflow", "recall", "status", "activity", "office", "margin", "doctors"].forEach(function (n, i) {
      var key = FEEDS + n + ".json";
      setTimeout(function () {
        saved(key).then(function (hit) {
          if (hit) return;
          realFetch(key + "?t=" + Date.now(), { cache: "no-store" }).then(function (r) { if (r.ok) save(key, r); }).catch(function () {});
        });
      }, i * 250);
    });
  }

  /* ================= 1. light / dark ================= */
  function label(a) {
    var light = root.getAttribute("data-theme") === "light";
    a.innerHTML = '<span class="ico" aria-hidden="true">' + (light ? "☾" : "☀") + "</span>" + (light ? "Dark" : "Light");
    a.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    a.setAttribute("title", light ? "Switch to dark mode" : "Switch to light mode");
  }
  function apply(v) {
    root.setAttribute("data-theme", v);
    try { localStorage.setItem(KEY, v); } catch (e) {}
    document.querySelectorAll(".theme-tog").forEach(label);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: v } }));
  }
  /* the new theme is unveiled as a circle opening from the switch, slowly enough to watch */
  var WIPE_MS = 900;
  function set(v, from) {
    if (reduce || !document.startViewTransition || !from) { apply(v); return; }
    var r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add("theme-wipe");
    var vt = document.startViewTransition(function () { apply(v); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + far + "px at " + x + "px " + y + "px)"] },
        { duration: WIPE_MS, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
    var done = function () { root.classList.remove("theme-wipe"); };
    vt.finished.then(done, done);
  }
  window.ismileTheme = {
    get: function () { return root.getAttribute("data-theme"); },
    set: set,
    toggle: function (from) { set(this.get() === "light" ? "dark" : "light", from); },
    /* resolved value of a CSS custom property, for canvas drawing */
    css: function (name) { return getComputedStyle(root).getPropertyValue(name).trim(); },
  };

  /* a doctor's face from their name: small file in lists, the full photo when big. Initial shows if the photo fails. */
  var FACE = { lau: "lau", jia: "lau", amy: "amy", azelia: "azelia", joan: "joan", lim: "joan", ling: "ling", mah: "mah", priscilla: "priscilla", yeoh: "yeoh", ong: "ong", jean: "ong" };
  var FULL = { lau: "dr_Lau Jia Yin", amy: "dr_Amy Chin Mei Kuen", azelia: "dr_Azelia Lau Yiling", joan: "dr_Lim Zhi Yin Joan", ling: "dr_Ling", mah: "dr_Mah Haw Yeng", priscilla: "dr_Priscilla", yeoh: "dr_yeoh", ong: "dr_Jean Ong" };
  function faceKey(name) {
    var m = /^Dr\.?\s+(\S+)/i.exec(String(name || ""));
    if (!m || /yuen/i.test(name)) return "";
    return FACE[m[1].toLowerCase()] || "";
  }
  window.ismileTheme.faceUrl = function (name, big) {
    var k = faceKey(name);
    return !k ? "" : big ? "/images/doctors/" + encodeURIComponent(FULL[k]) + ".webp" : "/dashboard/faces/" + k + ".webp";
  };
  window.ismileTheme.face = function (name, cls) {
    var url = this.faceUrl(name, cls === "big");
    if (!url) return "";
    return '<span class="dv-face' + (cls ? " " + cls : "") + '"><i>' + String(name).replace(/^Dr\.?\s+/i, "").charAt(0).toUpperCase() + '</i><u style="background-image:url(\'' + url + '\')"></u></span>';
  };

  function mount() {
    if (document.querySelector(".theme-tog")) return;
    var nav = document.querySelector("header>nav, nav.topnav, nav.pagenav, header nav, nav");
    if (!nav) return;
    var a = document.createElement("a");
    a.href = "#"; a.className = "theme-tog"; a.setAttribute("role", "button");
    label(a);
    a.addEventListener("click", function (e) { e.preventDefault(); window.ismileTheme.toggle(a); });
    nav.appendChild(a);
    var act = nav.querySelector("a.active");
    if (act && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, act.offsetLeft - 12);
    /* a tap on another page answers at once: the hairline starts and the pill colour moves */
    nav.addEventListener("click", function (e) {
      var l = e.target.closest ? e.target.closest("a[href]") : null;
      if (!l || l === a || l.classList.contains("active") || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      var bar = document.getElementById("dash-progress");
      if (!bar) { bar = document.createElement("div"); bar.id = "dash-progress"; document.body.appendChild(bar); }
      bar.classList.add("on");
    });
  }
  /* coming back with the Back button must not leave the hairline running */
  window.addEventListener("pageshow", function () { var b = document.getElementById("dash-progress"); if (b) b.classList.remove("on"); });

  /* ================= 2. the clock (Malaysia time) ================= */
  var DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  function tick() {
    var cs = document.querySelectorAll("[data-clock]"); if (!cs.length) return;
    var n; try { n = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })); } catch (e) { n = new Date(); }
    var h = n.getHours(), hh = ((h + 11) % 12) + 1;
    var html = ("0" + hh).slice(-2) + ":" + ("0" + n.getMinutes()).slice(-2) + "<small>" + (h < 12 ? "AM" : "PM") + "</small>";
    var date = DOW[n.getDay()] + " · " + n.getDate() + " " + MON[n.getMonth()] + " " + n.getFullYear() + " · MYT";
    cs.forEach(function (el) { if (el.innerHTML !== html) el.innerHTML = html; });
    /* only the header clock: chart bars elsewhere also carry data-date */
    document.querySelectorAll(".clock [data-date]").forEach(function (el) { if (el.textContent !== date) el.textContent = date; });
  }

  /* ================= 3. motion ================= */
  function stagger() {
    var n = 0;
    document.querySelectorAll("[data-rise],.rise").forEach(function (el) {
      el.classList.add("rise"); el.style.setProperty("--i", Math.min(n++, 12));
    });
  }
  function countUp(el) {
    if (reduce || el.__counted) return; el.__counted = true;
    var node = null;
    for (var i = 0; i < el.childNodes.length; i++) { var c = el.childNodes[i]; if (c.nodeType === 3 && /\d/.test(c.nodeValue)) { node = c; break; } }
    if (!node) return;
    var txt = node.nodeValue, m = /(-?)(\d[\d,]*)(\.\d+)?/.exec(txt);
    if (!m) return;
    var to = parseFloat((m[2] + (m[3] || "")).replace(/,/g, "")), dec = m[3] ? m[3].length - 1 : 0;
    if (!to) return;
    var pre = txt.slice(0, m.index) + m[1], post = txt.slice(m.index + m[0].length), t0 = performance.now(), d = 700;
    function fmt(v) { return v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    function step(now) {
      var p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 4);
      if (!node.parentNode) return;
      node.nodeValue = p < 1 ? pre + fmt(to * e) + post : txt;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function watchCounts() {
    var done = false;
    function scan() {
      document.querySelectorAll("[data-countup]").forEach(function (el) { if (/\d/.test(el.textContent)) countUp(el); });
    }
    scan();
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function () { if (!done) scan(); });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    setTimeout(function () { done = true; mo.disconnect(); root.classList.add("settled"); }, 6000);
  }

  /* ================= 4b. loading states ================= */
  /* a card waiting for data shows lines in the shape of its content, not the word "loading" */
  function skeletons() {
    document.querySelectorAll(".empty").forEach(function (el) {
      if ((el.textContent || "").trim() !== "loading…") return;
      el.className = "sk"; el.setAttribute("role", "status"); el.setAttribute("aria-label", "Loading");
      el.innerHTML = "<i></i><i></i><i></i><i></i>";
    });
  }
  /* the other dashboard pages are fetched ahead of time, so a tap opens them without a wait */
  function preloadPages() {
    if (!TOP) return;
    var links = [].slice.call(document.querySelectorAll("header nav a[href^='/dashboard']")).filter(function (l) { return !l.classList.contains("active"); });
    var urls = links.map(function (l) { return l.getAttribute("href").split("#")[0]; }).filter(function (u, i, a) { return u && a.indexOf(u) === i; });
    if (!urls.length) return;
    try {
      if (window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
        var s = document.createElement("script"); s.type = "speculationrules";
        s.textContent = JSON.stringify({ prefetch: [{ urls: urls, eagerness: "eager" }] });
        document.head.appendChild(s);
        return;
      }
    } catch (e) {}
    urls.forEach(function (u) { var l = document.createElement("link"); l.rel = "prefetch"; l.href = u; l.as = "document"; document.head.appendChild(l); });
  }

  function idle(fn, ms) { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: ms }); else setTimeout(fn, ms); }
  /* called right after </header> in each page, so the clock and moon are there in the first
     paint. Finance's document is big enough to paint before DOMContentLoaded; without this its
     right-aligned nav sat 44px off until the moon arrived. */
  window.ismileTheme.header = function () { mount(); tick(); };
  /* resolves once the page transition has played, so heavy pages can start their work after it */
  var revealed = !("onpagereveal" in window) ? Promise.resolve() : new Promise(function (done) {
    window.addEventListener("pagereveal", function (e) {
      if (e.viewTransition) e.viewTransition.finished.then(done, done); else done();
    }, { once: true });
    setTimeout(done, 700);
  });
  window.ismileTheme.revealed = function () { return revealed; };
  function ready() {
    mount(); tick(); setInterval(tick, 5000); skeletons(); stagger(); watchCounts();
    var later = function () { idle(function () { preloadPages(); warmFeeds(); }, 2500); };
    if (document.readyState === "complete") later(); else window.addEventListener("load", later);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
