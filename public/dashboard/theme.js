/* iSmile dashboard — light/dark switch (owner, 18 Sep 2026).
   Loaded synchronously in <head> so the theme is set before first paint.
   Remembered per browser; dark is the default. Pages that draw on a canvas
   listen for the "themechange" event and read colours via ismileTheme.css(). */
(function () {
  var KEY = "ismile-dash-theme", root = document.documentElement;
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  var t = stored();
  root.setAttribute("data-theme", t === "light" ? "light" : "dark");

  function label(a) {
    var light = root.getAttribute("data-theme") === "light";
    a.innerHTML = '<span class="ico" aria-hidden="true">' + (light ? "☾" : "☀") + "</span>" + (light ? "Dark" : "Light");
    a.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  }
  function set(v) {
    root.setAttribute("data-theme", v);
    try { localStorage.setItem(KEY, v); } catch (e) {}
    document.querySelectorAll(".theme-tog").forEach(label);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: v } }));
  }
  window.ismileTheme = {
    get: function () { return root.getAttribute("data-theme"); },
    set: set,
    toggle: function () { set(this.get() === "light" ? "dark" : "light"); },
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
    a.addEventListener("click", function (e) { e.preventDefault(); window.ismileTheme.toggle(); });
    nav.appendChild(a);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
