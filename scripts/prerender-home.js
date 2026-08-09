/**
 * Pre-render the homepage into dist/index.html as REAL React markup, so the
 * browser paints the finished design immediately and main.jsx hydrates it
 * without changing a pixel.
 *
 * This replaces the older "#ssg-content" approach for "/" — a hand-written
 * static block that React deleted and rebuilt on mount, which every cold-cache
 * visitor saw as a ~1s flash of not-quite-the-real-page.
 *
 * It also splits the two jobs dist/index.html used to do:
 *   dist/index.html — the "/" document, now carrying pre-rendered homepage markup
 *   dist/app.html   — the empty SPA shell every unmatched route rewrites to
 *                     (see vercel.json)
 * Without that split, a route like /recall would be served homepage markup and
 * hydration would mismatch against it.
 *
 * Runs after both the client build and the SSR build. See package.json.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const root = process.cwd();
const distDir = path.resolve(root, 'dist');
const indexPath = path.resolve(distDir, 'index.html');
const appShellPath = path.resolve(distDir, 'app.html');
const ssrEntry = path.resolve(root, 'dist-ssr/entry-server.js');

const ROOT_DIV = '<div id="root"></div>';
const MARKER = '<!-- prerendered:home -->';

// The hero preloads are homepage art direction. Leaving them in the shared SPA
// shell makes /recall and 404s download a hero image they never display.
const HERO_PRELOAD = /^.*<link rel="preload" as="image"[^>]*family_hero[^>]*>\s*$/gm;

function fail(msg) {
  console.error('[prerender-home] ✗ ' + msg);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) fail('dist/index.html not found — run the client build first.');
if (!fs.existsSync(ssrEntry)) fail('dist-ssr/entry-server.js not found — run the SSR build first.');

let html = fs.readFileSync(indexPath, 'utf-8');

if (html.includes(MARKER)) {
  console.log('[prerender-home] dist/index.html already pre-rendered — skipping.');
  process.exit(0);
}
if (!html.includes(ROOT_DIV)) {
  fail('Could not find an empty ' + ROOT_DIV + ' in dist/index.html.');
}

// 1. The untouched shell becomes the SPA fallback, minus the homepage-only
//    hero preloads.
fs.writeFileSync(appShellPath, html.replace(HERO_PRELOAD, ''), 'utf-8');
console.log('[prerender-home] ✓ Wrote dist/app.html (SPA fallback shell).');

// 2. Render "/" with the real components and inject it.
const { render } = await import(pathToFileURL(ssrEntry).href);
const markup = render('/');

if (!markup || markup.length < 1000) {
  fail('Render produced suspiciously little markup (' + (markup ? markup.length : 0) + ' bytes).');
}

// A function replacement — the markup contains "$" sequences that String.replace
// would otherwise interpret as substitution patterns.
html = html.replace(ROOT_DIV, () => MARKER + '\n<div id="root">' + markup + '</div>');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('[prerender-home] ✓ Pre-rendered "/" into dist/index.html (' +
  Math.round(markup.length / 1024) + ' KB of markup).');
