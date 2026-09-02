/**
 * /dashboard/edith  →  (middleware Basic Auth)  →  api/edith.js  →  Edith bridge on the Contabo box.
 *
 * The browser talks to /dashboard/edith so the same Basic Auth that gates the dashboards applies and the
 * browser attaches the cached credentials itself. The middleware rewrites here, and this function re-checks
 * the Authorization header against DASHBOARD_PASSWORD so a direct hit on /api/edith is refused.
 *
 * Bridge contract (box side, see Contabo loop/edith_bridge.py) — asynchronous, because Edith can take minutes:
 *   POST { message, user, session } → 202 { job, session }   then   POST { poll: job } → { status: pending|done|error, reply?, elapsed }
 *   The page polls; this function never waits on the model.
 * The bridge presents a self-signed certificate; its PEM is pinned via EDITH_BRIDGE_CA so the hop is
 * encrypted and authenticated without a public CA. Until those three env vars exist the line reports
 * `not_connected` and the page says so — nothing is faked.
 */
import https from 'node:https';

export const config = { maxDuration: 60 };

function authed(req) {
  const want = process.env.DASHBOARD_PASSWORD;
  if (!want) return false;
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const decoded = Buffer.from(h.slice(6), 'base64').toString('utf8');
  const pass = decoded.slice(decoded.indexOf(':') + 1);
  return pass === want;
}

function callBridge(payload) {
  const url = new URL(process.env.EDITH_BRIDGE_URL);
  const body = JSON.stringify(payload);
  const opts = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
      authorization: 'Bearer ' + process.env.EDITH_BRIDGE_TOKEN,
    },
    ca: process.env.EDITH_BRIDGE_CA,      // pinned self-signed cert
    servername: url.hostname,
    timeout: 25000,
  };
  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, json: { error: 'bad_bridge_response', raw: data.slice(0, 300) } }); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('bridge timeout')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const { message, session, poll } = req.body || {};
  if (poll) {
    if (typeof poll !== 'string' || poll.length > 64) return res.status(400).json({ error: 'bad_request' });
  } else if (!message || typeof message !== 'string' || message.length > 4000) {
    return res.status(400).json({ error: 'bad_request' });
  }
  if (!process.env.EDITH_BRIDGE_URL || !process.env.EDITH_BRIDGE_TOKEN || !process.env.EDITH_BRIDGE_CA) {
    return res.status(503).json({ error: 'not_connected' });
  }
  try {
    const out = await callBridge(poll ? { poll } : { message, user: 'lu-deck', session: session || 'deck' });
    if (out.status === 200 || out.status === 202) return res.status(out.status).json(out.json);
    if (out.status === 404 && poll) return res.status(404).json(out.json);
    return res.status(502).json({ error: 'bridge_error', detail: out.json });
  } catch (e) {
    return res.status(502).json({ error: 'bridge_unreachable', detail: e.message });
  }
}
