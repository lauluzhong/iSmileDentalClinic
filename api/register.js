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
  'https://ismile-registration-form.vercel.app',
  'https://ismile.com.my',
  'https://www.ismile.com.my',
];

const SHEET_TAB = process.env.REGISTRATION_SHEET_TAB || 'Registrations';

// Google Sheets caps a cell at 50,000 characters.
const MAX_CELL = 45000;

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
  const fullJson = JSON.stringify({ meta: m, answers: answersNoSig });

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
    signatureDataUri || '',
  ].map(cell);
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
  const name = (a.fullName || '').trim() || (a.preferredName || '').trim() || '—';
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

  // Sanity checks only — the form validates properly before it submits.
  if (!a || typeof a !== 'object' || payload.meta?.form !== 'iSmile patient registration') {
    return res.status(400).json({ error: 'Not a registration payload' });
  }
  if (!a.fullName || !(a.mobileFull || a.mobile)) {
    return res.status(400).json({ error: 'Missing name or mobile' });
  }

  try {
    await appendToSheet(buildRow(payload));
  } catch (error) {
    // Log the failure, never the submission body.
    console.error('Sheet append failed:', error.message);
    return res.status(502).json({ ok: false, error: 'Could not record the registration' });
  }

  // Best-effort; a Telegram hiccup must not fail a recorded registration.
  await notifyTelegram(payload);

  return res.status(200).json({ ok: true });
}
