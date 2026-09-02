import { next, rewrite } from '@vercel/functions';

/*
 * Single gated namespace for everything non-public: /dashboard
 *
 * The marketing site (everything else under public/) stays fully public.
 * Everything under /dashboard is behind one shared password (HTTP Basic
 * Auth). The browser prompts once, then caches the credential for the
 * origin, so the embedded margin + analytics dashboards and their data
 * files load seamlessly inside the Command Center.
 *
 * Password lives in the DASHBOARD_PASSWORD environment variable (Vercel →
 * Project → Settings → Environment Variables). If unset the gate fails
 * CLOSED (503) — it never serves the dashboard unprotected.
 *
 * Clean URLs (the only ones that should ever be shared):
 *   /dashboard            → Command Center hub   (public/dashboard/index.html)
 *   /dashboard/hq         → iSmile HQ pillar view (public/dashboard/hq.html)
 *   /dashboard/margin     → margin dashboard      (public/dashboard/margin.html)
 *   /dashboard/analytics  → website analytics      (public/dashboard/analytics.html)
 *   /dashboard/margin-data.js → data asset for the margin dashboard
 *
 * Legacy URLs are 308-redirected to the above so nothing old keeps working.
 */

const REALM = 'iSmile Command Center';

// old URL → new canonical URL
const LEGACY = {
  '/command-center.html': '/dashboard',
  '/dashboards/margin-dashboard.html': '/dashboard/margin',
  '/dashboards/margin-data.js': '/dashboard/margin-data.js',
  '/analytics-dashboard.html': '/dashboard/analytics',
};

// clean URL → physical file to serve (rewrite, address bar unchanged)
// gated proxy to Edith (api/edith.js re-checks the same Basic Auth header itself)
const PROXIES = {
  '/dashboard/edith': '/api/edith',
};

const PAGES = {
  '/dashboard': '/dashboard/index.html',
  '/dashboard/': '/dashboard/index.html',
  '/dashboard/hq': '/dashboard/hq.html',
  '/dashboard/margin': '/dashboard/margin.html',
  '/dashboard/analytics': '/dashboard/analytics.html',
  '/dashboard/deck': '/dashboard/deck.html',
};

// physical .html → its clean URL (so the .html form is never user-facing)
const CANONICAL = {
  '/dashboard/index.html': '/dashboard',
  '/dashboard/hq.html': '/dashboard/hq',
  '/dashboard/margin.html': '/dashboard/margin',
  '/dashboard/analytics.html': '/dashboard/analytics',
  '/dashboard/deck.html': '/dashboard/deck',
};

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/command-center.html',
    '/dashboards/:path*',
    '/analytics-dashboard.html',
  ],
};

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  // 1) Redirect legacy URLs to the new canonical ones (no data served here).
  if (LEGACY[pathname]) {
    return Response.redirect(new URL(LEGACY[pathname], request.url), 308);
  }

  // 2) Auth gate — everything under /dashboard. Fail closed.
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    return new Response('Dashboard is locked: DASHBOARD_PASSWORD is not set.', {
      status: 503,
    });
  }
  const header = request.headers.get('authorization') || '';
  let authed = false;
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      authed = decoded.slice(decoded.indexOf(':') + 1) === expected;
    } catch {
      authed = false;
    }
  }
  if (!authed) {
    return new Response('Authentication required.', {
      status: 401,
      headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
    });
  }

  // Authenticated below this point.

  // 3) Collapse physical .html URLs onto their clean form.
  if (CANONICAL[pathname]) {
    return Response.redirect(new URL(CANONICAL[pathname], request.url), 308);
  }

  // 4) Serve clean URLs from their physical file (address bar stays clean).
  if (PAGES[pathname]) {
    return rewrite(new URL(PAGES[pathname], request.url));
  }
  if (PROXIES[pathname]) {
    return rewrite(new URL(PROXIES[pathname], request.url));
  }

  // 5) Authenticated assets (e.g. /dashboard/margin-data.js) continue.
  return next();
}
