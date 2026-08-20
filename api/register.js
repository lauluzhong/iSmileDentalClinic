// Vercel Serverless Function — Patient Registration → Google Sheet
// Receives the digital registration form's submission payload (the same JSON
// the form's "Download JSON" button produces) and appends one row to a
// PRIVATE Google Sheet the front desk works from.
//
// This is PATIENT PII + medical history:
//   - the Sheet must stay private (shared only with the clinic + the service
//     account) — see Website/REGISTRATION-BACKEND-SETUP.md
//   - the submission body is NEVER logged (only error statuses are)
//   - data travels in the POST body, never in a URL
//
// Env vars (set in Vercel, ismile-website project):
//   GOOGLE_SERVICE_ACCOUNT_JSON   full service-account key file, pasted as-is
//   REGISTRATION_SHEET_ID         the Sheet's ID (from its URL)
//   REGISTRATION_SHEET_TAB        optional, defaults to "Registrations"
//   TELEGRAM_BOT_TOKEN            existing booking bot (reused, optional)
//   TELEGRAM_REGISTRATION_CHAT_ID optional; falls back to TELEGRAM_CHAT_ID

import { JWT } from 'google-auth-library';

// The form lives on its own Vercel project, so this endpoint is cross-origin.
const ALLOWED_ORIGINS = [
  'https://register.ismile.com.my',
  'https://ismile-registration-form.vercel.app',
  'https://ismile.com.my',
  'https://www.ismile.com.my',
];

// Rate limit: this is per warm instance, not global — serverless gives us no
// shared counter without a KV store. It is enough to blunt a naive flood from
// one source; real abuse protection is Vercel's bot rules at the edge.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 12; // a family registering together must not trip this
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

const SHEET_TAB = process.env.REGISTRATION_SHEET_TAB || 'Registrations';

// Google Sheets caps a cell at 50,000 characters.
const MAX_CELL = 45000;

// A truncated data: URI is a BROKEN image, not a partial one — it will never
// render. For the signature (the signed consent record) we record the failure
// instead of silently storing something unopenable.
const SIG_MAX = 49000;
const sigCell = (v) => {
  const str = String(v || '');
  if (!str) return '';
  return str.length > SIG_MAX ? `[signature too large to store: ${str.length} chars]` : str;
};

const cell = (v) => {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  if (v === undefined || v === null) return '';
  const s = String(v);
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL) + '…[truncated]' : s;
};

// Column order mirrors the form's staff view (OpenDental entry order).
// Header row for the Sheet is listed in REGISTRATION-BACKEND-SETUP.md.
function buildRow(payload) {
  const a = payload.answers || {};
  const m = payload.meta || {};

  const icOrPassport = a.noIC
    ? (a.passportNo ? `Passport ${a.passportNo}` : '')
    : (a.icNumber || '');
  const occ = a.occupation === 'Other' ? (a.occupationOther || 'Other') : (a.occupation || '');
  const src = a.source === 'Other' ? (a.sourceOther || 'Other') : (a.source || '');

  const alerts = [];
  if (a.allergies === 'Yes') alerts.push(`ALLERGY: ${a.allergiesList || ''}`);
  if (a.premed === 'Yes') alerts.push(`PREMED: ${a.premedDetail || ''}`);
  if (a.premed === "I'm not sure") alerts.push('PREMED: patient unsure — check with their doctor');
  if (a.pregnant === 'Yes' || a.pregnant === 'Possibly') alerts.push(`PREGNANCY: ${a.pregnant}`);
  if (a.bleeding === 'Yes') alerts.push('BLEEDING after extraction: Yes');

  // Everything except the signature image, so nothing is ever lost even if a
  // future form version adds fields this column list does not know about.
  const { signatureDataUri, ...answersNoSig } = a;
  let fullJson = JSON.stringify({ meta: m, answers: answersNoSig });
  if (fullJson.length > MAX_CELL) {
    // Truncating JSON yields an unparseable cell, which defeats the point of
    // this column (the "nothing is ever lost" safety net). Record the overflow.
    fullJson = JSON.stringify({ meta: m, _note: 'answers too large to store inline', _chars: fullJson.length });
  }

  const submittedMyt = new Date(m.submittedAt || Date.now()).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short',
  });

  return [
    submittedMyt,
    a.fullName, a.preferredName, a.gender, a.dob,
    m.derivedAge === null || m.derivedAge === undefined ? '' : m.derivedAge,
    icOrPassport, a.nationality,
    a.addr1, a.addr2, a.town, a.state, a.postcode,
    a.mobileFull || a.mobile, a.email,
    occ, src, a.referrerName, a.lastVisit, a.lastClean,
    a.ecName, a.ecRelationship, a.ecMobileFull || a.ecMobile,
    a.payer, a.payerName, a.payerMobileFull || a.payerMobile, a.payerEmail,
    a.guardianName, a.guardianRelationship, a.guardianMobileFull || a.guardianMobile, a.guardianEmail,
    a.underDoctor, a.doctorCondition, a.doctorName, a.doctorPhoneFull || a.doctorPhone,
    a.medicines, a.medicinesList, a.allergies, a.allergiesList,
    a.premed, a.premedDetail, a.bleeding,
    a.pregnant, a.breastfeeding, a.contraceptives,
    alerts.join(' | '),
    a.consentTreatment, a.consentRecall, a.consentRetention, a.declaration,
    m.consentVersion,
    a.filledFor, a.signerRole, a.signerName, a.signerRelationship,
    m.isMinor ? 'YES' : 'No',
    fullJson,
  ].map(cell).concat([sigCell(signatureDataUri)]);
}

async function appendToSheet(row) {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.REGISTRATION_SHEET_ID;
  if (!raw || !sheetId) throw new Error('Google Sheet not configured');

  const sa = JSON.parse(raw);
  const client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const range = encodeURIComponent(`${SHEET_TAB}!A1`);
  await client.request({
    // ⚠️ valueInputOption=RAW is what stops Google Sheets FORMULA INJECTION: a
    // patient typing =HYPERLINK(...) or @SUM(...) into a field is stored as
    // literal text. Do NOT change this to USER_ENTERED to get dates parsing.
    url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    data: { values: [row] },
  });
}

// Heads-up in the existing booking-bot chat. Deliberately PII-minimal:
// name only — no IC, no contact details, no medical information.
async function notifyTelegram(payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_REGISTRATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  // Same visual language as the website's "New Booking Request" message, but a
  // distinct header: bookings are LEADS; this fires when a patient who already
  // has an appointment finishes the registration form. Deliberately PII-minimal
  // (no IC, no medical detail) — the Sheet holds the full record.
  const a = payload.answers || {};
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Telegram caps a message at 4096 chars; a pathological name must not cost
  // the front desk their notification.
  const name = ((a.fullName || '').trim() || (a.preferredName || '').trim() || '—').slice(0, 120);
  const mobile = (a.mobileFull || a.mobile || '').trim() || '—';
  const isMinor = !!(payload.meta && payload.meta.isMinor);
  const timeDisplay = new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short',
  });
  const lines = [
    '📝 <b>New Patient Registration</b> — form completed',
    '',
    `📋 <b>Name:</b> ${esc(name)}`,
    `📞 <b>Mobile:</b> ${esc(mobile)}`,
  ];
  if (isMinor) lines.push('🧒 <b>Under 18</b> — contact the guardian');
  lines.push('', '🗂 Full details are in the <b>Registrations sheet</b>', `🕐 <b>Time:</b> ${timeDisplay} (MYT)`);
  const text = lines.join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const result = await res.json();
    if (!result.ok) console.error('Telegram notify error:', result.description);
  } catch (err) {
    console.error('Telegram notify failed:', err.message);
  }
}

async function notifyTelegramFailure(name) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_REGISTRATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const text = [
    '\u26a0\ufe0f <b>Registration NOT recorded</b>',
    '',
    `A form was submitted for <b>${esc(String(name).slice(0, 120))}</b> but could not be saved.`,
    'Their answers are still on the device they used — ask them to tap "Try again" before they leave.',
  ].join('\n');
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch (err) {
    console.error('Telegram failure-alert failed:', err.message);
  }
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
  const a = payload.answers;

  // Honeypot: a hidden field no human ever sees. A filled one means a bot.
  // We answer with a visible error rather than a fake success on purpose — if
  // this ever fires on a real patient, the form says so and keeps their answers
  // on the device, instead of losing a registration silently.
  if (payload.meta && String(payload.meta.confirmRef || '').trim() !== '') {
    console.warn('Registration rejected: honeypot filled');
    return res.status(400).json({ ok: false, error: 'Could not record the registration' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'];
  if (rateLimited(ip)) {
    console.warn('Registration rate-limited for one address');
    return res.status(429).json({ ok: false, error: 'Too many registrations from this connection. Please try again shortly.' });
  }

  // Sanity checks only — the form validates properly before it submits.
  if (!a || typeof a !== 'object' || payload.meta?.form !== 'iSmile patient registration') {
    return res.status(400).json({ error: 'Not a registration payload' });
  }
  const nameIn = String(a.fullName || '').trim();
  const mobileIn = String(a.mobileFull || a.mobile || '').trim();
  if (!nameIn || !mobileIn) {
    // .trim() matters: a whitespace-only value is truthy and would otherwise
    // sail through as a blank row.
    return res.status(400).json({ error: 'Missing name or mobile' });
  }
  // Deliberately LOOSE. The form validates properly; this only stops junk from
  // a client that bypassed it. Any Unicode letter is a valid name — rejecting a
  // real patient costs far more than accepting an odd one.
  if (nameIn.length > 200 || !/^\+?[0-9 ().\-]{5,30}$/.test(mobileIn)) {
    return res.status(400).json({ error: 'Name or mobile does not look valid' });
  }

  try {
    await appendToSheet(buildRow(payload));
  } catch (error) {
    // Log the failure, never the submission body.
    console.error('Sheet append failed:', error.message);
    // The one case staff most need to know about: the patient thinks they are
    // done, but nothing was recorded. Best-effort alert so the desk can catch
    // them while they are still in the chair.
    await notifyTelegramFailure(nameIn);
    return res.status(502).json({ ok: false, error: 'Could not record the registration' });
  }

  // Best-effort; a Telegram hiccup must not fail a recorded registration.
  await notifyTelegram(payload);

  return res.status(200).json({ ok: true });
}
