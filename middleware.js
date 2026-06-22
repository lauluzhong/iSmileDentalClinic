import { next, rewrite } from '@vercel/functions';

/*
 * Server-side gate for the iSmile Command Center.
 *
 * The marketing site (everything else under public/) stays fully public.
 * Only the dashboard paths below are protected, with a single shared
 * password via HTTP Basic Auth. The browser prompts once, then caches the
 * credential for the origin, so the embedded margin dashboard + its data
 * file load seamlessly inside the Command Center.
 *
 * The password lives in the DASHBOARD_PASSWORD environment variable
 * (Vercel project settings → Environment Variables). If it is not set the
 * gate fails CLOSED (503) — it never serves the dashboard unprotected.
 *
 * Canonical URL is /dashboard. The raw /command-center.html is redirected
 * to /dashboard so there is only one dashboard URL.
 */

const REALM = 'iSmile Command Center';
const FILE = '/command-center.html';

export const config = {
  matcher: [
    '/dashboard',
    '/command-center.html',
    '/dashboards/:path*',
    '/analytics-dashboard.html',
  ],
};

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  // Fail closed: if no password is configured, deny rather than expose.
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    return new Response('Dashboard is locked: DASHBOARD_PASSWORD is not set.', {
      status: 503,
    });
  }

  // Check HTTP Basic Auth. Username is ignored; only the password must match.
  const header = request.headers.get('authorization') || '';
  let authed = false;
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      const pass = decoded.slice(decoded.indexOf(':') + 1);
      authed = pass === expected;
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

  // Collapse the raw .html URL onto the single canonical /dashboard URL.
  if (pathname === '/command-center.html') {
    return Response.redirect(new URL('/dashboard', request.url), 308);
  }

  // Serve the Command Center at /dashboard without changing the address bar.
  if (pathname === '/dashboard') {
    return rewrite(new URL(FILE, request.url));
  }

  // Authenticated sub-resources (dashboards/*, analytics) continue as normal.
  return next();
}
