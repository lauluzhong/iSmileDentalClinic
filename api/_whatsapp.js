// Shared helper (the leading underscore keeps Vercel from deploying it as a route).
//
// Mirrors a Telegram notification into the WhatsApp group "iSmile New Patient
// Notification", posted by Edith. Path: this function → Edith bridge on the
// Contabo box (POST /notify, same bearer token + pinned self-signed cert the
// Dashboard's /dashboard/edith line uses) → OpenClaw gateway → WhatsApp.
// The bridge decides the destination group (loop/config/notify.json); nothing
// here can redirect it. Added 2 Oct 2026; Telegram stays in parallel until the
// owner retires it.
//
// Best-effort by design: a WhatsApp hiccup must never fail a booking or a
// recorded registration. The bridge itself spools and retries a failed send.
import https from 'node:https';

// Telegram HTML → WhatsApp: <b>x</b> → *x*, drop any other tags, decode the
// three entities the notifiers escape.
export function telegramHtmlToWhatsApp(html) {
  return String(html || '')
    .replace(/<\/?b>/g, '*')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function notifyWhatsApp(kind, text) {
  const base = process.env.EDITH_BRIDGE_URL;
  const token = process.env.EDITH_BRIDGE_TOKEN;
  const ca = process.env.EDITH_BRIDGE_CA;
  if (!base || !token || !ca) return Promise.resolve({ sent: false, error: 'not_configured' });

  const url = new URL('/notify', base);
  const body = JSON.stringify({ kind, text: String(text).slice(0, 3500) });
  const opts = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
      authorization: 'Bearer ' + token,
    },
    ca,
    servername: url.hostname,
    timeout: 10000,
  };
  return new Promise((resolve) => {
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let json = {};
        try { json = JSON.parse(data); } catch (e) { /* keep {} */ }
        if (res.statusCode !== 200 && res.statusCode !== 202) {
          console.error('WhatsApp notify error:', res.statusCode, json.error || '');
        }
        resolve({ status: res.statusCode, ...json });
      });
    });
    req.on('timeout', () => req.destroy(new Error('bridge timeout')));
    req.on('error', (err) => {
      console.error('WhatsApp notify failed:', err.message);
      resolve({ sent: false, error: err.message });
    });
    req.write(body);
    req.end();
  });
}
