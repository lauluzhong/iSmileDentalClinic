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
let ssr = null;

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
  await prerenderIntl(fs.readFileSync(appShellPath, 'utf-8'));
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
ssr = await import(pathToFileURL(ssrEntry).href);
const { render } = ssr;
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

// 3. Malay and Chinese pages (19 Nov 2026). Each gets its own static file at
//    dist/<path>/index.html, so Vercel serves the translated markup, title,
//    canonical, hreflang and <html lang> before its SPA rewrite applies.
//    The page is lazy-loaded, so the first render only starts the import;
//    the second, after it resolves, renders the real page.
await prerenderIntl(fs.readFileSync(appShellPath, 'utf-8'));

async function prerenderIntl(shell) {
  const s = ssr || await import(pathToFileURL(ssrEntry).href);
  // Head tags the English shell carries that each page must own instead.
  const OWNED = [
    /^\s*<title>[\s\S]*?<\/title>\s*$/gm,
    /^\s*<meta name="description"[^>]*>\s*$/gm,
    /^\s*<link rel="canonical"[^>]*>\s*$/gm,
    /^\s*<meta property="(og|twitter):[^"]*"[^>]*>\s*$/gm,
  ];
  for (const r of s.INTL_ROUTES) {
    s.render(r.path, {});
    await s.pageLoaders.intl();
    await new Promise((res) => setTimeout(res, 0));
    const ctx = {};
    const markup = s.render(r.path, ctx);
    const h = ctx.helmet;
    if (!markup.includes('intl-page')) fail('Intl page did not render for ' + r.path);
    let page = shell;
    for (const re of OWNED) page = page.replace(re, '');
    // House rule: nothing price-like on the translated pages.
    page = page.replace(/^\s*"priceRange": "[^"]*",\n/m, '');
    const lang = (h.htmlAttributes.toString().match(/lang="([^"]+)"/) || [])[1];
    if (!lang) fail('No lang attribute for ' + r.path);
    page = page.replace(/<html lang="[^"]*">/, '<html lang="' + lang + '">');
    const head = [h.title, h.meta, h.link, h.script].map((x) => x.toString()).join('\n  ');
    page = page.replace('</head>', () => '  ' + head + '\n</head>');
    page = page.replace(ROOT_DIV, () => '<!-- prerendered:' + r.path + ' -->\n<div id="root">' + markup + '</div>');
    const out = path.join(distDir, r.path, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, page, 'utf-8');
    console.log('[prerender-home] ✓ Pre-rendered "' + r.path + '" (' + lang + ').');
  }
}
