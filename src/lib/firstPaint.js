/**
 * "First paint" means the render whose markup already exists in the HTML the
 * browser downloaded: the build-time server render, and the client's matching
 * hydration render.
 *
 * Entrance animations have to be skipped for exactly those two renders. The
 * homepage is pre-rendered so the first thing painted IS the finished design;
 * if the hydration render re-applied `initial={{ opacity: 0 }}` it would blank
 * the hero out and fade it back in, which is the flash pre-rendering exists to
 * remove.
 *
 * On the client the answer is simply "did #root arrive with markup in it".
 * Routes served the empty SPA shell (app.html) start false, so their entrance
 * animations play exactly as they always have.
 */
let firstPaint =
  typeof document === 'undefined' ||
  !!document.getElementById('root')?.firstChild;

/**
 * Read once per component instance — `useState(() => isFirstPaint())` — never
 * on every render. A component that was pre-rendered must keep its entrance
 * skipped for its whole life, even after endFirstPaint() flips the flag.
 */
export function isFirstPaint() {
  return firstPaint;
}

/** Called from App once the first commit lands. Later mounts animate normally. */
export function endFirstPaint() {
  firstPaint = false;
}
