// Vercel Serverless Function — Airway Evaluation questionnaire → Google Sheet
// Receives the airway form's submission (Operations/Airway Questionnaire,
// served at https://ismile-forms.vercel.app/airway), RECOMPUTES the three
// scores server-side, and appends one row to its OWN private Sheet. Built
// 3 Oct 2026 on the owner's approval (Dr Ling signed off the form and its PDF).
//
// ⚠️ Deliberately NOT the Registrations Sheet and NOT the registration key
// (owner ruling 3 Oct 2026): a Contabo job reads this Sheet to send the PDF,
// and that box must never hold the key to IC numbers or medical history. So
// the airway Sheet has its own service account, and there is no fallback.
//
// This is PATIENT PII + health information (a child's sleep and breathing):
//   - same safeguards as api/register.js: CORS allowlist, honeypot, per-IP
//     limit, valueInputOption=RAW, the body is NEVER logged
//   - NO message on success: the one message per form is the WhatsApp PDF the
//     Contabo job sends. Only a failure is alerted (booking chat + WhatsApp group).
//
// Env vars: AIRWAY_SHEET_ID, AIRWAY_SHEET_TAB (default "Airway"),
// AIRWAY_SERVICE_ACCOUNT_JSON (airway-only key, no fallback), plus
// TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID and EDITH_BRIDGE_* for the failure alert.

import { JWT } from 'google-auth-library';
import { notifyWhatsApp, telegramHtmlToWhatsApp } from './_whatsapp.js';

const ALLOWED_ORIGINS = [
  'https://ismile-forms.vercel.app',
  'https://forms.ismile.com.my',
  'https://ismile.com.my',
  'https://www.ismile.com.my',
];

// Per warm instance, as in register.js. 40 because the clinic shares one
// Wi-Fi address (a family can also fill this in for several children).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 40;
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

const TAB = process.env.AIRWAY_SHEET_TAB || 'Airway';
const MAX_CELL = 45000;
const cell = (v) => {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  if (v === undefined || v === null) return '';
  const s = String(v);
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL) + '…[truncated]' : s;
};

// ---- the instruments (item keys + allowed values) ----
const PSQ = ['psq1a', 'psq1b', 'psq1c', 'psq1d', 'psq1e', 'psq2', 'psq3a', 'psq3b', 'psq3c',
  'psq4a', 'psq4b', 'psq5', 'psq6', 'psq7', 'psq8', 'psq9',
  'psq10a', 'psq10b', 'psq10c', 'psq10d', 'psq10e', 'psq10f'];
const ESS = ['ess1', 'ess2', 'ess3', 'ess4', 'ess5', 'ess6', 'ess7', 'ess8'];
const NOSE = ['nose1', 'nose2', 'nose3', 'nose4', 'nose5'];
const ITEMS = [...PSQ, ...ESS, ...NOSE];
const PSQ_VALUES = ['Yes', 'No', "Don't know"];
const ESS_VALUES = ['0', '1', '2', '3'];
const NOSE_VALUES = ['0', '1', '2', '3', '4'];
const FILLED_BY = ['Mother', 'Father', 'Guardian', 'The patient', 'Other'];

// Fixed column order — the Contabo PDF job reads this tab BY HEADER NAME.
// Do not reorder or rename without changing that job.
const HEADER = [
  'Submitted (MYT)', 'Submitted ISO', 'Patient name', 'DOB', 'Age', 'Filled in by',
  'Completer name', 'Mobile', 'First time or follow-up', 'PSQ yes', 'PSQ answered',
  'PSQ ratio', 'PSQ positive', 'Epworth total', 'NOSE score', 'NOSE band',
  ...ITEMS, 'Full JSON', 'PDF link', 'PDF status', 'PDF sent at',
];

// Scores are recomputed here; the client's own `scores` are never trusted.
//   PSQ ratio = yes ÷ (yes + no), "Don't know" excluded; positive if ≥ 0.33
//   Epworth   = sum of ess1–8, 0–24
//   NOSE      = sum of nose1–5 × 5, 0–100; 0 none · 5–25 mild · 30–50 moderate
//               · 55–75 severe · 80–100 extreme
export function computeScores(a) {
  let yes = 0, no = 0;
  for (const k of PSQ) { if (a[k] === 'Yes') yes++; else if (a[k] === 'No') no++; }
  const answered = yes + no;
  const ratio = answered ? yes / answered : null;
  const ess = ESS.reduce((t, k) => t + Number(a[k]), 0);
  const nose = NOSE.reduce((t, k) => t + Number(a[k]), 0) * 5;
  const band = nose === 0 ? 'none' : nose <= 25 ? 'mild' : nose <= 50 ? 'moderate' : nose <= 75 ? 'severe' : 'extreme';
  return {
    psqYes: yes, psqAnswered: answered,
    psqRatio: ratio === null ? '' : Math.round(ratio * 100) / 100,
    psqPositive: ratio !== null && ratio >= 0.33,
    ess, nose, noseBand: band,
  };
}

function validate(payload) {
  const a = payload && payload.answers;
  if (!a || typeof a !== 'object' || !payload.meta || payload.meta.form !== 'iSmile airway questionnaire') {
    return 'Not an airway questionnaire payload';
  }
  const name = String(a.patientName || '').trim();
  const mobile = String(a.mobile || '').trim();
  if (!name || name.length > 200) return 'Missing or invalid patient name';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(a.dob || '')) || isNaN(Date.parse(a.dob))) return 'Missing or invalid date of birth';
  if (!/^\+?[0-9 ().\-]{5,30}$/.test(mobile)) return 'Missing or invalid mobile';
  if (!FILLED_BY.includes(a.filledBy)) return 'Invalid "filled in by"';
  for (const k of PSQ) if (!PSQ_VALUES.includes(a[k])) return `Missing or invalid answer: ${k}`;
  for (const k of ESS) if (!ESS_VALUES.includes(String(a[k]))) return `Missing or invalid answer: ${k}`;
  for (const k of NOSE) if (!NOSE_VALUES.includes(String(a[k]))) return `Missing or invalid answer: ${k}`;
  return null;
}

function ageFrom(dob) {
  const [y, m, d] = String(dob).split('-').map(Number);
  const now = new Date(Date.now() + 8 * 3600 * 1000); // MYT wall clock, read as UTC
  let age = now.getUTCFullYear() - y;
  const mo = now.getUTCMonth() + 1;
  if (mo < m || (mo === m && now.getUTCDate() < d)) age--;
  return age >= 0 && age < 130 ? age : '';
}

function filledByLabel(a) {
  return a.filledBy === 'Other' ? (String(a.filledByOther || '').trim() || 'Other') : a.filledBy;
}

function buildRow(payload, sc) {
  const a = payload.answers;
  const m = payload.meta || {};
  const submitted = new Date(Date.parse(m.submittedAt) || Date.now());
  const fullJson = JSON.stringify({ meta: m, answers: a, scoresServer: sc });
  return [
    submitted.toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short' }),
    submitted.toISOString(),
    String(a.patientName).trim(),
    a.dob,
    ageFrom(a.dob),
    filledByLabel(a),
    a.filledBy === 'The patient' ? '' : String(a.fillerName || '').trim(),
    String(a.mobile).trim(),
    a.doneBefore,
    sc.psqYes, sc.psqAnswered, sc.psqRatio, sc.psqPositive ? 'Yes' : 'No',
    sc.ess, sc.nose, sc.noseBand,
    ...ITEMS.map((k) => a[k]),
    fullJson.length > MAX_CELL ? JSON.stringify({ meta: m, _note: 'too large to store inline' }) : fullJson,
    '', '', '', // PDF link · PDF status · PDF sent at — filled by the Contabo PDF job
  ].map(cell);
}

function sheetsClient() {
  // No fallback to the registration key or Sheet, on purpose (see header).
  const raw = process.env.AIRWAY_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.AIRWAY_SHEET_ID;
  if (!raw || !sheetId) throw new Error('Airway Sheet not configured');
  const sa = JSON.parse(raw);
  const client = new JWT({ email: sa.client_email, key: sa.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  return { client, base: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}` };
}

// Create the "Airway" tab with its header row the first time it is needed.
// Cached per warm instance; a race with a parallel first submission is
// harmless ("already exists" is ignored and the header write is idempotent).
let tabReady = false;
async function ensureTab(client, base) {
  if (tabReady) return;
  const meta = await client.request({ url: `${base}?fields=sheets.properties.title`, method: 'GET' });
  const titles = (meta.data.sheets || []).map((s) => s.properties.title);
  if (!titles.includes(TAB)) {
    try {
      await client.request({
        url: `${base}:batchUpdate`, method: 'POST',
        data: { requests: [{ addSheet: { properties: { title: TAB, gridProperties: { frozenRowCount: 1 } } } }] },
      });
    } catch (err) {
      if (!/already exists/i.test(String(err.message))) throw err;
    }
  }
  const head = await client.request({ url: `${base}/values/${encodeURIComponent(TAB + '!1:1')}`, method: 'GET' });
  if (!(head.data.values && head.data.values[0] && head.data.values[0].length)) {
    await client.request({
      url: `${base}/values/${encodeURIComponent(TAB + '!A1')}?valueInputOption=RAW`, method: 'PUT',
      data: { values: [HEADER] },
    });
  }
  tabReady = true;
}

async function appendRow(row) {
  const { client, base } = sheetsClient();
  await ensureTab(client, base);
  await client.request({
    // ⚠️ RAW is the formula-injection defence (see register.js). Never USER_ENTERED.
    url: `${base}/values/${encodeURIComponent(TAB + '!A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    data: { values: [row] },
  });
}

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function notifyFailure(text, kind) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_REGISTRATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  const whatsapp = notifyWhatsApp(kind, telegramHtmlToWhatsApp(text));
  if (token && chatId) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      });
      const j = await r.json();
      if (!j.ok) console.error('Telegram notify error:', j.description);
    } catch (err) {
      console.error('Telegram notify failed:', err.message);
    }
  }
  await whatsapp;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const payload = req.body || {};

  // Honeypot — a visible error, never a fake success (same reasoning as register.js).
  if (payload.meta && String(payload.meta.confirmRef || '').trim() !== '') {
    console.warn('Airway rejected: honeypot filled');
    return res.status(400).json({ ok: false, error: 'Could not record the questionnaire' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'];
  if (rateLimited(ip)) {
    console.warn('Airway rate-limited for one address');
    return res.status(429).json({ ok: false, error: 'Too many submissions from this connection. Please try again shortly.' });
  }

  const problem = validate(payload);
  if (problem) return res.status(400).json({ ok: false, error: problem });

  const a = payload.answers;
  const sc = computeScores(a);
  const name = String(a.patientName).trim().slice(0, 120);

  try {
    await appendRow(buildRow(payload, sc));
  } catch (error) {
    console.error('Airway sheet append failed:', error.message);
    await notifyFailure([
      `⚠️ <b>Airway form NOT recorded</b> — ${esc(name)}`,
      '',
      'The answers are still on the device used — ask the family to tap "Try again".',
    ].join('\n'), 'airway_failed');
    return res.status(502).json({ ok: false, error: 'Could not record the questionnaire' });
  }

  // No success message by design: the Contabo job's WhatsApp PDF is the one
  // message per form (owner ruling 3 Oct 2026).
  return res.status(200).json({ ok: true });
}
