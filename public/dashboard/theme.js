/* iSmile dashboard — light/dark switch + the shared motion (redesign 6 Nov 2026).
   Loaded synchronously in <head> so the theme is set before first paint.
   Remembered per browser; with no stored choice it follows the system setting.
   Pages that draw on a canvas listen for the "themechange" event and read
   colours via ismileTheme.css(). */
(function () {
  var KEY = "ismile-dash-theme", root = document.documentElement;
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function system() { try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; } }
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var t = stored();
  root.setAttribute("data-theme", t === "light" || t === "dark" ? t : system());

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
  /* the new theme opens as a circle from the switch (about 370ms) */
  function set(v, from) {
    if (reduce || !document.startViewTransition || !from) { apply(v); return; }
    var r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(function () { apply(v); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + far + "px at " + x + "px " + y + "px)"] },
        { duration: 370, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  }
  window.ismileTheme = {
    get: function () { return root.getAttribute("data-theme"); },
    set: set,
    toggle: function (from) { set(this.get() === "light" ? "dark" : "light", from); },
    /* resolved value of a CSS custom property, for canvas drawing */
    css: function (name) { return getComputedStyle(root).getPropertyValue(name).trim(); },
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
  }

  /* ---- entrance: cards rise in one after another, once ---- */
  function stagger() {
    var n = 0;
    document.querySelectorAll("[data-rise],.rise").forEach(function (el) {
      el.classList.add("rise"); el.style.setProperty("--i", Math.min(n++, 12));
    });
  }
  /* ---- the hero figure counts up once, the first time it has a value ---- */
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
  function ready() { mount(); stagger(); watchCounts(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
