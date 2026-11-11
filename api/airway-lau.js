// Vercel Serverless Function: Dr Lau's Airway Assessment → Google Sheet
// The AAPD "Pediatric Airway Assessment" as Dr Lau Jia Yin's own form
// (served at https://forms.ismile.com.my/airwaywithdrlau; page built by
// Operations/Airway Questionnaire/tools/build_airway_lau.py). Same design and
// safeguards as api/airway.js (Dr Ling's form), which this file does not touch:
//   - same private Sheet (AIRWAY_SHEET_ID) but its OWN tab, default "Airway Dr Lau"
//   - same credentials rule: AIRWAY_SERVICE_ACCOUNT_JSON, else
//     GOOGLE_SERVICE_ACCOUNT_JSON (see airway.js header for why that is allowed)
//   - CORS allowlist, honeypot, per-IP limit, valueInputOption=RAW, the body is
//     NEVER logged, a failure is alerted on Telegram only
//   - after the append, the submission goes to the SAME Edith bridge path
//     (POST /airway) gated by AIRWAY_BRIDGE_ENABLED=1; the box routes on
//     meta.doctor === 'lau'. The bridge writes PDF link / status / sent-at back
//     into the row matched by "Submitted ISO", so keep those header names.
//
// Env vars: AIRWAY_SHEET_ID, AIRWAY_LAU_SHEET_TAB (default "Airway Dr Lau"),
// AIRWAY_SERVICE_ACCOUNT_JSON / GOOGLE_SERVICE_ACCOUNT_JSON, AIRWAY_BRIDGE_ENABLED,
// EDITH_BRIDGE_URL / _TOKEN / _CA, TELEGRAM_BOT_TOKEN / _CHAT_ID.

import { JWT } from 'google-auth-library';
import https from 'node:https';

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

const TAB = process.env.AIRWAY_LAU_SHEET_TAB || 'Airway Dr Lau';
const MAX_CELL = 45000;
const cell = (v) => {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  if (v === undefined || v === null) return '';
  const s = String(v);
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL) + '…[truncated]' : s;
};

export const FORM_ID = 'iSmile airway assessment (Dr Lau)';
const YN = ['No', 'Yes'];
const YND = ['No', 'Yes', 'Do not know'];
const RATING = ['Good', 'Fair', 'Poor'];
const GENDER = ['Male', 'Female'];
const FILLED_BY = ['Mother', 'Father', 'Guardian', 'Other'];

// [answer key, column header = the PDF's wording (lead-in + item), allowed values, detail label]
// Wording is VERBATIM from the AAPD form; keep in step with build_airway_lau.py.
export const QUESTIONS = [
  ["g_premature", "Was your child born prematurely?", YN, "How many weeks early?"],
  ["g_headface", "Does your child have a head / face condition at birth?", YN, "Describe"],
  ["g_movement", "Does your child have any history of: physical/developmental conditions affecting movement?", YN, "Describe"],
  ["g_tone", "Does your child have any history of: low muscle tone / feels floppy?", YN, "Describe"],
  ["g_resp", "Does your child have any history of: respiratory disease/breathing problems?", YN, "Describe"],
  ["g_smoke", "Does your child have any history of: repeated exposure to smoke?", YN, "Describe"],
  ["d_mouth", "Does your child often: tend to breathe through the mouth?", YND],
  ["d_headache", "Does your child often: wake up with headaches in the morning?", YND],
  ["d_restless", "Does your child often: seem restless, unable to sit still, or always on the go?", YND],
  ["d_focus", "Does your child often: interrupt others, have difficulty staying focused, or become easily frustrated?", YND],
  ["d_sleepy", "Do you or a teacher notice your child appears sleepy during the day?", YND],
  ["s_rating", "How would you rate your child’s sleep?", RATING],
  ["s_hours", "How many hours does your child sleep on average during a 24-hour period?", 'hours'],
  ["s_fast", "Does your child: fall asleep quickly?", YND],
  ["s_snore_half", "Does your child: snore more than half the time while sleeping?", YND],
  ["s_snore_loud", "Does your child: snore loudly while sleeping?", YND],
  ["s_struggle", "Does your child: have trouble breathing or struggle to breathe while asleep?", YND],
  ["s_stop", "Does your child: stop breathing during sleep?", YND],
  ["s_grind", "Does your child: grind his/her teeth while sleeping?", YND],
  ["s_seated", "Does your child: sleep in a seated position or with neck hyperextended?", YND],
  ["s_bedwet", "Does your child: occasionally wet the bed at night?", YND],
  ["s_sweat", "Does your child: experience excessive sweating while sleeping?", YND],
  ["s_hardwake", "Is your child hard to wake up in the morning?", YND],
];

// Fixed column order. The Apps Script / box match rows on "Submitted ISO" and
// write "PDF link", "PDF status", "PDF sent at" BY HEADER NAME: do not rename.
export const HEADER = [
  'Submitted (MYT)', 'Submitted ISO', 'Patient name', 'DOB', 'Age', 'Gender',
  'Filled in by', 'Completer name', 'Mobile',
  ...QUESTIONS.flatMap(([, text, , detail]) => (detail ? [text, `${text} (${detail})`] : [text])),
  'Yes count', 'Full JSON', 'PDF link', 'PDF status', 'PDF sent at',
];

// Recomputed here; the client's own counts are never trusted.
export function computeScores(a) {
  let yesCount = 0, dontKnowCount = 0;
  for (const [k, , allowed] of QUESTIONS) {
    if (allowed === YN || allowed === YND) {
      if (a[k] === 'Yes') yesCount++;
      else if (a[k] === 'Do not know') dontKnowCount++;
    }
  }
  return { yesCount, dontKnowCount };
}

function hoursValid(v) {
  const n = typeof v === 'number' ? v : (/^\d{1,2}(\.\d+)?$/.test(String(v).trim()) ? Number(v) : NaN);
  return Number.isFinite(n) && n >= 0 && n <= 24 && Math.round(n * 2) === n * 2;
}

export function validate(payload) {
  const a = payload && payload.answers;
  if (!a || typeof a !== 'object' || !payload.meta || payload.meta.form !== FORM_ID) {
    return 'Not a Dr Lau airway assessment payload';
  }
  const name = String(a.patientName || '').trim();
  const mobile = String(a.mobile || '').trim();
  const completer = String(a.filledByName || '').trim();
  if (!name || name.length > 200) return 'Missing or invalid patient name';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(a.dob || '')) || isNaN(Date.parse(a.dob))) return 'Missing or invalid date of birth';
  if (!GENDER.includes(a.gender)) return 'Invalid gender';
  if (!FILLED_BY.includes(a.filledBy)) return 'Invalid "filled in by"';
  if (!completer || completer.length > 200) return 'Missing or invalid completer name';
  if (!/^\+?[0-9 ().\-]{5,30}$/.test(mobile)) return 'Missing or invalid mobile';
  for (const [k, , allowed, detail] of QUESTIONS) {
    if (allowed === 'hours') {
      if (!hoursValid(a[k])) return `Missing or invalid answer: ${k}`;
      continue;
    }
    if (!allowed.includes(a[k])) return `Missing or invalid answer: ${k}`;
    if (detail && a[k] === 'Yes') {
      const d = String(a[`${k}_d`] || '').trim();
      if (!d || d.length > 2000) return `Missing or invalid detail: ${k}_d`;
    }
  }
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

function trimmed(a, k) {
  return typeof a[k] === 'string' ? a[k].trim() : '';
}

export function buildRow(payload, sc, submittedIso) {
  const a = payload.answers;
  const m = payload.meta || {};
  const submitted = new Date(submittedIso);
  const fullJson = JSON.stringify({ meta: m, answers: a, scoresServer: sc });
  return [
    submitted.toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short' }),
    submitted.toISOString(),
    String(a.patientName).trim(),
    a.dob,
    ageFrom(a.dob),
    a.gender,
    a.filledBy,
    String(a.filledByName).trim(),
    String(a.mobile).trim(),
    ...QUESTIONS.flatMap(([k, , allowed, detail]) => {
      const v = allowed === 'hours' ? Number(a[k]) : a[k];
      // a detail only counts when the answer is Yes (a stale draft value is dropped)
      return detail ? [v, a[k] === 'Yes' ? trimmed(a, `${k}_d`) : ''] : [v];
    }),
    sc.yesCount,
    fullJson.length > MAX_CELL ? JSON.stringify({ meta: m, _note: 'too large to store inline' }) : fullJson,
    '', '', '', // PDF link · PDF status · PDF sent at, filled by the box
  ].map(cell);
}

function sheetsClient() {
  // Own Sheet always; key fallback allowed while Contabo holds no Google key (see header).
  const raw = process.env.AIRWAY_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.AIRWAY_SHEET_ID; // never REGISTRATION_SHEET_ID
  if (!raw || !sheetId) throw new Error('Airway Sheet not configured');
  const sa = JSON.parse(raw);
  const client = new JWT({ email: sa.client_email, key: sa.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  return { client, base: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}` };
}

// Create the "Airway Dr Lau" tab with its header row the first time it is needed.
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
  const current = (head.data.values && head.data.values[0]) || [];
  if (current.join('\u0001') !== HEADER.join('\u0001')) {
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

async function notifyFailure(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_REGISTRATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
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
}

// Hand the recorded submission to the Edith bridge (POST /airway → 202).
// Best-effort: the row is already saved, so a bridge problem never fails the form.
function handToBridge(body) {
  const base = process.env.EDITH_BRIDGE_URL;
  if (process.env.AIRWAY_BRIDGE_ENABLED !== '1' || !base || !process.env.EDITH_BRIDGE_TOKEN || !process.env.EDITH_BRIDGE_CA) {
    return Promise.resolve();
  }
  const url = new URL('/airway', base);
  const data = JSON.stringify(body);
  return new Promise((resolve) => {
    const req = https.request({
      method: 'POST', hostname: url.hostname, port: url.port || 443, path: url.pathname,
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data),
                 authorization: 'Bearer ' + process.env.EDITH_BRIDGE_TOKEN },
      ca: process.env.EDITH_BRIDGE_CA, servername: url.hostname, timeout: 10000,
    }, (res) => {
      res.resume();
      if (res.statusCode !== 202 && res.statusCode !== 200) console.error('Airway (Dr Lau) bridge hand-off status:', res.statusCode);
      res.on('end', resolve);
    });
    req.on('timeout', () => req.destroy(new Error('bridge timeout')));
    req.on('error', (err) => { console.error('Airway (Dr Lau) bridge hand-off failed:', err.message); resolve(); });
    req.write(data);
    req.end();
  });
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
    console.warn('Airway (Dr Lau) rejected: honeypot filled');
    return res.status(400).json({ ok: false, error: 'Could not record the questionnaire' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'];
  if (rateLimited(ip)) {
    console.warn('Airway (Dr Lau) rate-limited for one address');
    return res.status(429).json({ ok: false, error: 'Too many submissions from this connection. Please try again shortly.' });
  }

  const problem = validate(payload);
  if (problem) return res.status(400).json({ ok: false, error: problem });

  const a = payload.answers;
  const sc = computeScores(a);
  const name = String(a.patientName).trim().slice(0, 120);

  const submittedIso = new Date(Date.parse((payload.meta || {}).submittedAt) || Date.now()).toISOString();

  try {
    await appendRow(buildRow(payload, sc, submittedIso));
  } catch (error) {
    console.error('Airway (Dr Lau) sheet append failed:', error.message);
    await notifyFailure([
      `⚠️ <b>Airway form (Dr Lau) NOT recorded</b> — ${esc(name)}`,
      '',
      'The answers are still on the device used — ask the family to tap "Try again".',
    ].join('\n'));
    return res.status(502).json({ ok: false, error: 'Could not record the questionnaire' });
  }

  // No success message from here: the bridge's WhatsApp PDF is the one message
  // per form (owner ruling 3 Oct 2026). submittedIso is the row's join key.
  await handToBridge({ submittedIso, meta: payload.meta, answers: a, scores: sc });
  return res.status(200).json({ ok: true });
}
