// Vercel Serverless Function — Careers application (non-doctor roles) → Google Sheet + Contabo hand-off
//
// Receives the careers form (name, phone, email, note, role, CV as base64) and:
//   1. appends one row to the clinic's PRIVATE "iSmile Patient Forms" Sheet, tab
//      "Careers" (ismile.general account; the website's service account is an
//      Editor there, same as api/register.js). The row is the permanent record.
//   2. hands the application to the Edith bridge on the Contabo box, POST /careers
//      (same token + pinned cert as /registration). The box's careers_worker.py
//      saves the CV to Drive through the Forms Drive saver (Apps Script owned by
//      ismile.general) and sends the owner ONE WhatsApp through the script-only
//      walogger sender. Nothing goes through Edith's gateway, so no applicant
//      data lands in her memory.
// Best-effort: a bridge hiccup never fails a recorded application. The CV is
// NEVER written to the Sheet, only its Drive link (written by the box).
// The submission body is never logged.
//
// Env (Vercel, i-smile-dental-clinic): GOOGLE_SERVICE_ACCOUNT_JSON,
//   CAREERS_SHEET_ID (falls back to REGISTRATION_SHEET_ID), CAREERS_SHEET_TAB
//   (default "Careers"), EDITH_BRIDGE_URL / _TOKEN / _CA.

import { JWT } from 'google-auth-library';
import { postToBridge } from './_whatsapp.js';

const MAX_CV_BYTES = 3 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const SHEET_TAB = process.env.CAREERS_SHEET_TAB || 'Careers';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;
const recentByIp = new Map();
function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const hits = (recentByIp.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);
  if (recentByIp.size > 500) {
    for (const [key, times] of recentByIp) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) recentByIp.delete(key);
    }
  }
  return hits.length > RATE_MAX;
}

// "Submitted ISO" is the join key the Drive saver uses to write "CV link" /
// "CV status" back into the row. Do not rename these three.
const HEADER = [
  'Submitted (MYT)', 'Role', 'Role slug', 'Full name', 'Phone', 'Email', 'About them',
  'CV filename', 'Submitted ISO', 'CV link', 'CV status', 'Notified at',
];
const MAX_CELL = 45000;
const cell = (v) => {
  if (v === undefined || v === null) return '';
  const s = String(v);
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL) + '…[truncated]' : s;
};

let tabReady = false;
async function ensureTab(client, base) {
  if (tabReady) return;
  const meta = await client.request({ url: `${base}?fields=sheets.properties.title`, method: 'GET' });
  const titles = (meta.data.sheets || []).map((x) => x.properties.title);
  if (!titles.includes(SHEET_TAB)) {
    try {
      await client.request({
        url: `${base}:batchUpdate`, method: 'POST',
        data: { requests: [{ addSheet: { properties: { title: SHEET_TAB, gridProperties: { frozenRowCount: 1 } } } }] },
      });
    } catch (err) {
      if (!/already exists/i.test(String(err.message))) throw err;
    }
  }
  const head = await client.request({ url: `${base}/values/${encodeURIComponent(SHEET_TAB + '!1:1')}`, method: 'GET' });
  if (!(head.data.values && head.data.values[0] && head.data.values[0].length)) {
    await client.request({
      url: `${base}/values/${encodeURIComponent(SHEET_TAB + '!A1')}?valueInputOption=RAW`, method: 'PUT',
      data: { values: [HEADER] },
    });
  }
  tabReady = true;
}

async function appendToSheet(row) {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.CAREERS_SHEET_ID || process.env.REGISTRATION_SHEET_ID;
  if (!raw || !sheetId) throw new Error('Google Sheet not configured');
  const sa = JSON.parse(raw);
  const client = new JWT({ email: sa.client_email, key: sa.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  await ensureTab(client, base);
  await client.request({
    // RAW stops formula injection (=HYPERLINK(...) stays literal text). Keep it.
    url: `${base}/values/${encodeURIComponent(`${SHEET_TAB}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    data: { values: [row] },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body || {};
  const name = String(b.name || '').trim().slice(0, 200);
  const phone = String(b.phone || '').trim();
  const email = String(b.email || '').trim().slice(0, 200);
  const message = String(b.message || '').trim().slice(0, 4000);
  const role = String(b.role || '').trim().slice(0, 120);
  const roleSlug = String(b.roleSlug || '').trim().slice(0, 80);
  const cv = b.cv && typeof b.cv === 'object' ? b.cv : null;

  if (!name || !/^\+?[0-9 ().\-]{5,30}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: 'Please check your name and phone number.' });
  }
  if (!role || !/^[a-z0-9-]{1,80}$/.test(roleSlug)) {
    return res.status(400).json({ ok: false, error: 'Missing role' });
  }
  if (!cv || !cv.base64) return res.status(400).json({ ok: false, error: 'Please attach your CV.' });
  const cvBytes = Buffer.from(String(cv.base64), 'base64');
  const cvMime = String(cv.mime || 'application/octet-stream');
  const cvName = String(cv.filename || 'cv.pdf').replace(/[^\w.\- ()]/g, '_').slice(0, 120);
  if (cvBytes.length === 0 || cvBytes.length > MAX_CV_BYTES || !ALLOWED_MIME.has(cvMime)) {
    return res.status(400).json({ ok: false, error: 'Please attach a PDF or Word CV under 3MB.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'];
  if (rateLimited(ip)) {
    console.warn('Careers application rate-limited for one address');
    return res.status(429).json({ ok: false, error: 'Too many applications from this connection. Please try again shortly.' });
  }

  const submittedIso = new Date(Date.parse(b.timestamp) || Date.now()).toISOString();
  const submittedMyt = new Date(submittedIso).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short',
  });
  const row = [submittedMyt, role, roleSlug, name, phone, email, message, cvName, submittedIso, '', '', ''].map(cell);

  try {
    await appendToSheet(row);
  } catch (error) {
    console.error('Careers Sheet append failed:', error.message);
    return res.status(502).json({ ok: false, error: 'Could not record the application' });
  }

  // Hand-off to the box: Drive save + owner WhatsApp. Best-effort.
  const handoff = await postToBridge('/careers', {
    submittedIso, role, roleSlug, name, phone, email, message,
    cv: { filename: cvName, mime: cvMime, base64: cvBytes.toString('base64') },
  }, 15000);
  if (handoff.status !== 202) console.error('Careers hand-off failed:', handoff.status, handoff.error || '');

  return res.status(200).json({ ok: true, notified: handoff.status === 202 });
}
