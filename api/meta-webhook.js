// Vercel Serverless Function — Meta (Facebook / Instagram) webhook receiver.
//
// GET  : Meta's subscription handshake. Echo hub.challenge when hub.mode is
//        "subscribe" and hub.verify_token matches META_VERIFY_TOKEN; else 403.
// POST : check X-Hub-Signature-256 (HMAC-SHA256 of the RAW body with
//        META_APP_SECRET); 401 if it fails. Otherwise hand the event JSON to the
//        Edith bridge on the Contabo box, POST /meta-event (same bearer token +
//        pinned cert as /notify), and answer Meta 200 within ~2 s whatever the
//        bridge does. No AI in this path. Payloads carry DMs and comments, so
//        the body is never logged; only status codes and error messages are.
//
// Env (Vercel, i-smile-dental-clinic): META_VERIFY_TOKEN, META_APP_SECRET,
//   EDITH_BRIDGE_URL / _TOKEN / _CA.

import crypto from 'node:crypto';
import { postToBridge } from './_whatsapp.js';

// Raw bytes are needed for the signature check.
export const config = { api: { bodyParser: false } };

const MAX_BODY = 1024 * 1024;
const FORWARD_TIMEOUT_MS = 1800;

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function signatureOk(raw, header, secret) {
  if (!secret || typeof header !== 'string' || !header.startsWith('sha256=')) return false;
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(raw).digest('hex'), 'hex');
  const given = Buffer.from(header.slice(7), 'hex');
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const q = req.query || {};
    const token = process.env.META_VERIFY_TOKEN;
    if (q['hub.mode'] === 'subscribe' && token && q['hub.verify_token'] === token) {
      res.setHeader('content-type', 'text/plain');
      return res.status(200).send(String(q['hub.challenge'] || ''));
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  let raw;
  try {
    raw = await readRaw(req);
  } catch (e) {
    console.error('Meta webhook: could not read body:', e.message);
    return res.status(400).send('Bad request');
  }

  if (!signatureOk(raw, req.headers['x-hub-signature-256'], process.env.META_APP_SECRET)) {
    console.warn('Meta webhook: signature check failed');
    return res.status(401).send('Unauthorized');
  }

  let event;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch (e) {
    console.error('Meta webhook: body is not JSON');
    return res.status(200).send('EVENT_RECEIVED');
  }

  // Forward, but never let the box hold up Meta's 200.
  const forward = await Promise.race([
    postToBridge('/meta-event', event, FORWARD_TIMEOUT_MS),
    new Promise((resolve) => setTimeout(() => resolve({ sent: false, error: 'forward timeout' }), FORWARD_TIMEOUT_MS + 100)),
  ]);
  if (!forward || (forward.status !== 200 && forward.status !== 202)) {
    console.error('Meta webhook: forward to bridge failed:', forward && (forward.status || forward.error));
  }
  return res.status(200).send('EVENT_RECEIVED');
}
