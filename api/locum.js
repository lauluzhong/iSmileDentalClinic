/**
 * /dashboard/locum[/...]  →  (middleware Basic Auth)  →  api/locum.js  →  the locum tool on the Contabo box.
 *
 * Same shape as api/edith.js: the middleware gates the path with the dashboard password, this function
 * re-checks that header, then forwards the request to the box over HTTPS with the pinned self-signed
 * certificate and the bridge Bearer token. The tool has its own sign-in on top (cookie), which is passed
 * through both ways, so the dashboard password alone never opens the locum data.
 *
 * Box side: loop/locum/tool/server.py on port 8444 (EDITH_BRIDGE_URL's host, port 8444).
 */
import https from 'node:https';

export const config = { maxDuration: 60, api: { bodyParser: false } };

function authed(req) {
  const want = process.env.DASHBOARD_PASSWORD;
  if (!want) return false;
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const decoded = Buffer.from(h.slice(6), 'base64').toString('utf8');
  return decoded.slice(decoded.indexOf(':') + 1) === want;
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });
  if (!process.env.EDITH_BRIDGE_URL || !process.env.EDITH_BRIDGE_TOKEN || !process.env.EDITH_BRIDGE_CA) {
    return res.status(503).json({ error: 'not_connected' });
  }
  const base = new URL(process.env.EDITH_BRIDGE_URL);
  const full = new URL(req.url, 'http://x');
  // middleware rewrote /dashboard/locum/<sub> to /api/locum?p=<sub> (sub keeps its own query string)
  const sub = full.searchParams.get('p') || '/';
  if (!sub.startsWith('/')) return res.status(400).json({ error: 'bad_path' });
  const body = await readBody(req);
  const opts = {
    method: req.method,
    hostname: base.hostname,
    port: 8444,
    path: sub,
    headers: {
      authorization: 'Bearer ' + process.env.EDITH_BRIDGE_TOKEN,
      'content-type': req.headers['content-type'] || 'application/json',
      'content-length': body.length,
      cookie: req.headers.cookie || '',
    },
    ca: process.env.EDITH_BRIDGE_CA,
    servername: base.hostname,
    timeout: 50000,
  };
  await new Promise((resolve) => {
    const up = https.request(opts, (r) => {
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => {
        res.status(r.statusCode || 502);
        for (const h of ['content-type', 'set-cookie', 'content-disposition']) {
          if (r.headers[h]) res.setHeader(h, r.headers[h]);
        }
        res.send(Buffer.concat(chunks));
        resolve();
      });
    });
    up.on('timeout', () => { up.destroy(new Error('timeout')); });
    up.on('error', (e) => { res.status(502).json({ error: 'bridge_error', detail: String(e.message || e) }); resolve(); });
    up.write(body);
    up.end();
  });
}
