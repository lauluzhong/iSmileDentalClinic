/* Finance > By doctor. Reads doctors.json (aggregates only, built on the box by build_doctor_view.py).
   Every period is computed there, because unique patients cannot be added up across months. */
(function () {
  var URL = "https://raw.githubusercontent.com/lauluzhong/iSmileDentalClinic/status/doctors.json";
  var RANGES = "https://raw.githubusercontent.com/lauluzhong/iSmileDentalClinic/status/doctors-ranges.json";   /* any run of months, fetched on first use */
  var D = null, R = null, loading = false, opened = false;
  var S = { doc: "all", period: "m12", metric: 0, sort: "production", dir: -1, lastHero: 0 };
  try { var s = JSON.parse(localStorage.getItem("dv") || "{}"); if (s.doc) S.doc = s.doc; if (s.period) S.period = s.period; } catch (e) {}
  var METRICS = [["Production", 0, true], ["Collection", 1, true], ["Patients", 2, false], ["Visits", 3, false]];
  var CALM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(n) { return Math.round(n || 0).toLocaleString("en-MY"); }
  function rm(n) { return (n < 0 ? "−" : "") + "RM" + num(Math.abs(n)); }
  function pct(a, b) { return b ? Math.round(a / b * 100) + "%" : "–"; }
  function one(n) { return (Math.round((n || 0) * 10) / 10).toFixed(1); }
  function nice(d) { var p = d.split("-"); return +p[2] + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1] - 1] + " " + p[0]; }
  function mon(m) { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m.slice(5) - 1]; }
  function face(name, cls) { return window.ismileTheme && ismileTheme.face ? ismileTheme.face(name, cls) : ""; }
  function range(p) { return nice(p.frm) === nice(p.to) ? nice(p.frm) : nice(p.frm).replace(/ \d{4}$/, p.frm.slice(0, 4) === p.to.slice(0, 4) ? "" : "$&") + " – " + nice(p.to); }
  function period() { return D.periods.filter(function (p) { return p.k === S.period; })[0] || D.periods[0]; }
  function save() { try { localStorage.setItem("dv", JSON.stringify({ doc: S.doc, period: S.period })); } catch (e) {} }
  function monthsIn(p) { return D.meta.months.indexOf(p.to.slice(0, 7)) - D.meta.months.indexOf(p.frm.slice(0, 7)) + 1; }
  function versus(p) {
    if (p.kind === "custom") return "vs the " + monthsIn(p) + " months before";
    if (p.kind === "month" || p.k === "last_month") return "vs month before";
    if (p.k === "this_month") return "vs same days last month";
    if (p.k === "ytd") return "vs same time last year";
    if (p.k.charAt(0) === "m") return "vs previous " + p.k.slice(1) + " months";
    return "";
  }
  function delta(now, was, p) {
    if (!was) return "";
    var c = Math.round((now - was) / Math.abs(was) * 100);
    return '<span class="dv-d ' + (c >= 0 ? "up" : "down") + '">' + (c >= 0 ? "+" : "−") + Math.abs(c) + "%</span>";
  }

  /* ---------- controls ---------- */
  function slide(wrap) {
    var ind = wrap && wrap.querySelector(".dv-ind"), on = wrap && wrap.querySelector(".on");
    if (!ind) return;
    if (!on) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1; ind.style.width = on.offsetWidth + "px"; ind.style.height = on.offsetHeight + "px";
    ind.style.transform = "translate(" + on.offsetLeft + "px," + on.offsetTop + "px)";
  }
  function controls() {
    var p = D.periods.filter(function (x) { return x.kind === "range"; });
    var months = D.periods.filter(function (x) { return x.kind === "month"; }).reverse();
    var opts = months.map(function (x) { return '<option value="' + x.k + '">' + esc(x.label) + "</option>"; }).join("");
    $("dv-controls").innerHTML =
      '<div class="dv-pills" id="dv-docs" role="group" aria-label="Doctor"><span class="dv-ind"></span>' +
      D.doctors.map(function (d) {
        return '<button type="button" data-doc="' + esc(d.key) + '" class="' + (d.key === S.doc ? "on" : "") + '">' +
          face(d.name) + esc(d.name) + "</button>";
      }).join("") + "</div>" +
      '<div class="dv-time"><div class="dv-pills small" id="dv-periods" role="group" aria-label="Timeframe"><span class="dv-ind"></span>' +
      p.map(function (x) { return '<button type="button" data-p="' + x.k + '" class="' + (x.k === S.period ? "on" : "") + '">' + esc(x.label) + "</button>"; }).join("") +
      '</div><div class="dv-range"><label>From<select id="dv-from">' + opts + '</select></label><label>To<select id="dv-to">' + opts + "</select></label></div>" +
      '<span class="dv-msg" id="dv-msg" role="status"></span></div>';
    $("dv-docs").onclick = function (e) { var b = e.target.closest("button"); if (b) choose({ doc: b.dataset.doc }); };
    $("dv-periods").onclick = function (e) { var b = e.target.closest("button"); if (b) choose({ period: b.dataset.p }); };
    $("dv-from").onchange = function () { pick(this.value, $("dv-to").value < this.value ? this.value : $("dv-to").value); };
    $("dv-to").onchange = function () { pick($("dv-from").value > this.value ? this.value : $("dv-from").value, this.value); };
    syncRange();
    requestAnimationFrame(function () {
      slide($("dv-docs")); slide($("dv-periods"));
      ["dv-docs", "dv-periods"].forEach(function (id) {   /* phones: the chosen pill starts in view */
        var w = $(id), on = w.querySelector(".on");
        if (on) w.scrollLeft = on.offsetLeft - (w.clientWidth - on.offsetWidth) / 2;
      });
    });
  }
  function syncRange() { var p = period(); $("dv-from").value = p.frm.slice(0, 7); $("dv-to").value = p.to.slice(0, 7); }
  /* the file holding every run of months: 3.8MB, so only fetched once someone picks one */
  function ranges() {
    if (!R) R = fetch(RANGES, { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function (e) { R = null; throw e; });
    return R;
  }
  function addRange(k, all) {
    if (D.periods.some(function (p) { return p.k === k; })) return true;
    if (!all[k]) return false;
    var a = k.split("_"), e = a[1].split("-"), last = new Date(+e[0], +e[1], 0).getDate(), to = a[1] + "-" + last, frm = a[0] + "-01";
    D.periods.push({ k: k, label: mon(a[0]) + " " + a[0].slice(0, 4) + " to " + mon(a[1]) + " " + a[1].slice(0, 4), kind: "custom",
      frm: frm < D.meta.data_from ? D.meta.data_from : frm, to: to > D.meta.as_of ? D.meta.as_of : to });
    D.doctors.forEach(function (d) { if (all[k][d.key]) D.blocks[d.key][k] = all[k][d.key]; });
    return true;
  }
  function pick(a, b) {
    if (a === b) return choose({ period: a });
    var k = a + "_" + b, msg = $("dv-msg");
    if (D.periods.some(function (p) { return p.k === k; })) return choose({ period: k });
    msg.textContent = "Loading…";
    ranges().then(function (all) { msg.textContent = addRange(k, all) ? "" : "No figures for those months."; if (!msg.textContent) choose({ period: k }); else syncRange(); })
      .catch(function () { msg.textContent = "Could not load those months."; syncRange(); });
  }
  function choose(c) {
    if (c.doc) S.doc = c.doc;
    if (c.period) S.period = c.period;
    save();
    document.querySelectorAll("#dv-docs button").forEach(function (b) { b.classList.toggle("on", b.dataset.doc === S.doc); });
    document.querySelectorAll("#dv-periods button").forEach(function (b) { b.classList.toggle("on", b.dataset.p === S.period); });
    syncRange();
    slide($("dv-docs")); slide($("dv-periods"));
    var on = document.querySelector("#dv-docs .on");
    if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "center", behavior: CALM ? "auto" : "smooth" });
    render();
  }

  /* ---------- parts ---------- */
  function hero(b, p, doc) {
    var c = b.cmp || {};
    return '<div class="dv-hero hero-skin"><div class="dv-who">' + face(doc.name, "big") + "<div><b>" + esc(doc.name) + "</b><span>" + range(p) + "</span></div></div>" +
      '<div class="dv-lab">Production</div><div class="dv-big" id="dv-big">' + rm(b.production) + "</div>" +
      '<div class="dv-sub">' + (c.production ? delta(b.production, c.production) + " " + versus(p) : "") + "</div></div>";
  }
  function stat(label, value, sub, d) {
    return '<div class="dv-card dv-stat"><div class="dv-lab">' + label + '</div><div class="dv-v">' + value + (d || "") + '</div><div class="dv-sub">' + sub + "</div></div>";
  }
  function row(l, v, s) { return '<div class="dv-line"><span>' + l + "</span><b>" + v + (s ? "<small>" + s + "</small>" : "") + "</b></div>"; }
  function trend() {
    var p = period(), mm = D.meta.months, rows = D.trend[S.doc] || [], end = mm.indexOf(p.to.slice(0, 7)), start = mm.indexOf(p.frm.slice(0, 7));
    var from = end - start + 1 > 12 ? start : Math.max(0, end - 11);
    var cols = [], max = 1, mt = METRICS[S.metric];
    for (var i = from; i <= end; i++) { var v = rows[i] ? rows[i][mt[1]] : 0; if (v > max) max = v; cols.push({ m: mm[i], v: v, on: i >= start && i <= end }); }
    return '<div class="dv-card dv-trend"><div class="dv-head"><h3>Month by month</h3><div class="dv-mini" id="dv-metric">' +
      METRICS.map(function (m, i) { return '<button type="button" data-i="' + i + '" class="' + (i === S.metric ? "on" : "") + '">' + m[0] + "</button>"; }).join("") + "</div></div>" +
      '<div class="dv-cols" style="--n:' + cols.length + '">' + cols.map(function (c, i) {
        var label = mt[2] ? rm(c.v) : num(c.v);
        return '<div class="dv-col' + (c.on ? " on" : "") + '" title="' + mon(c.m) + " " + c.m.slice(0, 4) + ": " + label + '"><div class="dv-track"><div class="dv-fill" style="height:' + (c.v / max * 100).toFixed(1) + "%;animation-delay:" + Math.min(i * 18, 280) + 'ms"></div></div>' +
          '<span>' + (cols.length > 18 && i % 3 ? "" : mon(c.m)) + "</span></div>";
      }).join("") + "</div></div>";
  }
  function ages(b) {
    var labs = D.meta.bands, n = labs.length - 1, tot = 0, max = 1, i;
    for (i = 0; i < n; i++) { tot += b.age[i]; if (b.age[i] > max) max = b.age[i]; }
    var g = b.gender, gt = g[0] + g[1], html = "";
    for (i = 0; i < n; i++) html += '<div class="dv-col on"><b>' + pct(b.age[i], tot) + '</b><div class="dv-track"><div class="dv-fill" style="height:' + (b.age[i] / max * 100).toFixed(1) + "%;animation-delay:" + i * 40 + 'ms"></div></div><span>' + labs[i] + "</span></div>";
    return '<div class="dv-card"><div class="dv-head"><h3>Age of patients</h3></div><div class="dv-cols ages" style="--n:' + n + '">' + html + "</div>" +
      (gt ? '<div class="dv-split"><div class="dv-splitbar"><i style="width:' + (g[0] / gt * 100).toFixed(1) + '%"></i></div><div class="dv-splitlab"><span>Female ' + pct(g[0], gt) + "</span><span>Male " + pct(g[1], gt) + "</span></div></div>" : "") +
      (b.age[n] ? '<p class="dv-note">' + num(b.age[n]) + " with no birth date on file are left out.</p>" : "") + "</div>";
  }
  function bars(b) {
    var list = b.cats.filter(function (c) { return c[1] > 0; }), top = list.slice(0, 8), rest = list.slice(8), max = top.length ? top[0][1] : 1;
    if (rest.length) top.push(["All others", rest.reduce(function (a, c) { return a + c[1]; }, 0), rest.reduce(function (a, c) { return a + c[2]; }, 0)]);
    var tot = list.reduce(function (a, c) { return a + c[1]; }, 0) || 1;
    return '<div class="dv-card"><div class="dv-head"><h3>Type of procedure</h3></div>' + top.map(function (c, i) {
      return '<div class="dv-bar"><span class="n">' + esc(c[0]) + '</span><div class="dv-hbar"><div style="width:' + Math.max(1.5, c[1] / max * 100).toFixed(1) + "%;animation-delay:" + i * 30 + 'ms"></div></div><b>' + rm(c[1]) + "<small>" + pct(c[1], tot) + " · " + num(c[2]) + " done</small></b></div>";
    }).join("") + (list.length ? "" : '<p class="dv-note">No procedures with a charge in this period.</p>') + "</div>";
  }
  function top(b) {
    return '<div class="dv-card"><div class="dv-head"><h3>Top procedures</h3></div>' +
      (b.procs.map(function (x) { return row(esc(x[0]), rm(x[1]), num(x[2]) + " done"); }).join("") || '<p class="dv-note">None in this period.</p>') + "</div>";
  }
  function patients(b) {
    return '<div class="dv-card"><div class="dv-head"><h3>Patients</h3></div>' +
      row("Unique patients", num(b.patients)) + row("New patients", num(b.newPatients)) + row("Returning patients", num(b.returning)) +
      row("Patients with 2 or more visits", num(b.repeatPatients), pct(b.repeatPatients, b.patients)) +
      row("Repeat appointments", num(b.repeatVisits)) +
      row("Visits per patient", one(b.patients ? b.visits / b.patients : 0)) +
      row("Production per patient", rm(b.patients ? b.production / b.patients : 0)) +
      row("Left with next visit booked", pct(b.booked, b.visits), num(b.booked) + " of " + num(b.visits)) +
      (b.newMature ? row("New patients back within 6 months", pct(b.newCameBack, b.newMature), num(b.newCameBack) + " of " + num(b.newMature)) : row("New patients back within 6 months", "Too early")) +
      row("Broken appointments", num(b.broken), pct(b.broken, b.broken + b.attendedAppts)) +
      '<p class="dv-note">Broken appointments are marked late, so recent weeks read low.</p></div>';
  }
  function money(b, doc, ahead) {
    var h = b.chairHours;
    return '<div class="dv-card"><div class="dv-head"><h3>Money and chair time</h3></div>' +
      row("Production", rm(b.production)) + row("Lab (estimate)", rm(-b.lab)) +
      row("Locum (estimate)", doc.salaried ? "Salaried" : rm(-b.locum)) + row("Chair-time cost", rm(-b.burn)) +
      '<div class="dv-line total"><span>True margin</span><b>' + rm(b.trueMargin) + "<small>" + pct(b.trueMargin, b.production) + "</small></b></div>" +
      row("Chair hours", num(h)) + row("Days worked", num(b.days)) +
      row("Production per chair hour", rm(h ? b.production / h : 0)) + row("True margin per chair hour", rm(h ? b.trueMargin / h : 0)) +
      row("Production per day worked", rm(b.days ? b.production / b.days : 0)) +
      row("Discounts", rm(b.discounts)) + row("Write-offs", rm(b.writeOffs)) +
      (ahead ? row("Booked in the next 30 days", num(ahead.appts), num(ahead.hours) + " hours") : "") + "</div>";
  }
  var COL = [["production", "Production", 1], ["collection", "Collection", 1], ["trueMargin", "True margin", 1], ["mp", "Margin", 2], ["mh", "Margin per hour", 1],
             ["patients", "Patients", 0], ["newPatients", "New", 0], ["repeatVisits", "Repeat appts", 0], ["bk", "Next visit booked", 2]];
  function compare() {
    var rows = D.doctors.filter(function (d) { return d.key !== "all" && D.blocks[d.key][S.period]; }).map(function (d) {
      var b = D.blocks[d.key][S.period];
      return { d: d, production: b.production, collection: b.collection, trueMargin: b.trueMargin, patients: b.patients, newPatients: b.newPatients, repeatVisits: b.repeatVisits,
               mp: b.production ? b.trueMargin / b.production : 0, mh: b.chairHours ? b.trueMargin / b.chairHours : 0, bk: b.visits ? b.booked / b.visits : 0 };
    }).sort(function (a, c) { return (a[S.sort] - c[S.sort]) * S.dir; });
    if (!rows.length) return "";
    var ong = rows.some(function (r) { return r.d.salaried; });
    return '<div class="dv-card dv-all"><div class="dv-head"><h3>All doctors</h3></div><div class="dv-scroll"><table class="dv-table"><thead><tr><th>Doctor</th>' +
      COL.map(function (c) { return '<th data-s="' + c[0] + '" class="' + (S.sort === c[0] ? "on" : "") + '"><button type="button">' + c[1] + (S.sort === c[0] ? (S.dir < 0 ? " ↓" : " ↑") : "") + "</button></th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) {
        return '<tr data-doc="' + esc(r.d.key) + '" class="' + (r.d.key === S.doc ? "on" : "") + '"><th><button type="button">' + face(r.d.name) + esc(r.d.name) + "</button></th>" +
          COL.map(function (c) { var v = r[c[0]]; return "<td>" + (c[2] === 1 ? rm(v) : c[2] === 2 ? Math.round(v * 100) + "%" : num(v)) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>" +
      (ong ? '<p class="dv-note">Dr Ong is salaried. Her pay sits in overhead, so her margin reads high next to the locum doctors.</p>' : "") + "</div>";
  }

  /* ---------- render ---------- */
  function countTo(el, to) {
    var from = S.lastHero; S.lastHero = to;
    if (CALM || from === to || !el) return;
    var t0 = performance.now(), dur = 520, end = rm(to);
    setTimeout(function () { if (el.isConnected) el.textContent = end; }, dur + 120);  /* lands even if frames pause */
    (function tick(t) {
      if (!el.isConnected) return;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = rm(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function bind() {
    var m = $("dv-metric");
    if (m) m.onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      S.metric = +b.dataset.i;
      var card = document.querySelector(".dv-trend"), wrap = document.createElement("div");
      wrap.innerHTML = trend(); card.replaceWith(wrap.firstChild); bind();
    };
    document.querySelectorAll(".dv-table thead [data-s]").forEach(function (th) {
      th.onclick = function () {
        if (S.sort === th.dataset.s) S.dir = -S.dir; else { S.sort = th.dataset.s; S.dir = -1; }
        var card = document.querySelector(".dv-all"), wrap = document.createElement("div");
        wrap.innerHTML = compare(); card.replaceWith(wrap.firstChild); bind();
      };
    });
    document.querySelectorAll(".dv-table tbody tr").forEach(function (tr) {
      tr.onclick = function () { window.scrollTo({ top: 0, behavior: CALM ? "auto" : "smooth" }); choose({ doc: tr.dataset.doc }); };
    });
    var a = $("dv-all-time");
    if (a) a.onclick = function () { choose({ period: "all" }); };
  }
  function render() {
    var doc = D.doctors.filter(function (d) { return d.key === S.doc; })[0], p = period();
    var b = D.blocks[S.doc] && D.blocks[S.doc][S.period], box = $("dv-body");
    if (!b) {
      box.innerHTML = '<div class="dv-card dv-empty"><p>No activity for ' + esc(doc.name) + " in this period.</p>" +
        '<button type="button" class="dv-btn" id="dv-all-time">Show all time</button></div>' + compare();
      bind(); return;
    }
    var c = b.cmp || {};
    box.innerHTML = '<div class="dv-grid">' + hero(b, p, doc) + '<div class="dv-stats">' +
      stat("Collection", rm(b.collection), pct(b.collection, b.production) + " of production", c.collection ? delta(b.collection, c.collection) : "") +
      stat("True margin", rm(b.trueMargin), pct(b.trueMargin, b.production) + " of production", c.trueMargin ? delta(b.trueMargin, c.trueMargin) : "") +
      stat("Patients", num(b.patients), num(b.newPatients) + " new · " + num(b.returning) + " returning", c.patients ? delta(b.patients, c.patients) : "") +
      stat("Visits", num(b.visits), num(b.repeatVisits) + " repeat appointments", c.visits ? delta(b.visits, c.visits) : "") + "</div>" +
      '<div class="dv-w7">' + trend() + '</div><div class="dv-w5">' + ages(b) + "</div>" +
      '<div class="dv-w7">' + bars(b) + top(b) + '</div><div class="dv-w5">' + patients(b) + money(b, doc, D.ahead[S.doc]) + "</div>" +
      '<div class="dv-w12">' + compare() + "</div></div>";
    box.querySelectorAll(".dv-grid>*").forEach(function (el, i) { el.style.animationDelay = Math.min(i * 40, 240) + "ms"; });
    countTo($("dv-big"), b.production);
    bind();
  }
  function skeleton() {
    var sk = '<div class="sk"><i></i><i></i><i></i><i></i></div>';
    $("dv-body").innerHTML = '<div class="dv-grid"><div class="dv-hero dv-card">' + sk + "</div>" +
      '<div class="dv-stats">' + [1, 2, 3, 4].map(function () { return '<div class="dv-card dv-stat">' + sk + "</div>"; }).join("") +
      '</div><div class="dv-w7"><div class="dv-card">' + sk + sk + '</div></div><div class="dv-w5"><div class="dv-card">' + sk + sk + "</div></div></div>";
  }
  function load() {
    if (loading) return; loading = true; skeleton();
    fetch(URL, { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      D = j; loading = false;
      if (!D.doctors.some(function (d) { return d.key === S.doc; })) S.doc = "all";
      var saved = S.period;
      if (!D.periods.some(function (p) { return p.k === saved; })) S.period = "m12";
      controls(); render();
      if (saved.indexOf("_") > 0) pick(saved.split("_")[0], saved.split("_")[1]);   /* a run of months chosen last time */
    }).catch(function () {
      loading = false;
      $("dv-body").innerHTML = '<div class="dv-card dv-empty"><p>Could not load the doctor figures.</p><button type="button" class="dv-btn" id="dv-retry">Try again</button></div>';
      $("dv-retry").onclick = load;
    });
  }
  window.DoctorView = {
    open: function () {
      if (!opened) { opened = true; load(); return; }
      if (D) requestAnimationFrame(function () { slide($("dv-docs")); slide($("dv-periods")); });
    }
  };
  window.addEventListener("resize", function () { if (D) { slide($("dv-docs")); slide($("dv-periods")); } });
})();
