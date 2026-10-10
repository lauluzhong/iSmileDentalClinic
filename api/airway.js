// Vercel Serverless Function — Airway Evaluation questionnaire → Google Sheet
// Receives the airway form's submission (Operations/Airway Questionnaire,
// served at https://ismile-forms.vercel.app/airway), RECOMPUTES the three
// scores server-side, and appends one row to its OWN private Sheet. Built
// 3 Oct 2026 on the owner's approval (Dr Ling signed off the form and its PDF).
//
// ⚠️ Deliberately NOT the Registrations Sheet (owner rulings 3 Oct 2026). The
// row lives in its own Sheet (AIRWAY_SHEET_ID). Credentials: AIRWAY_SERVICE_ACCOUNT_JSON
// if set, else the registration service account — acceptable ONLY because the
// Contabo box holds NO Google key in this design (the PDF goes to Drive through
// an Apps Script web app owned by Lau). If a Google key is ever placed on
// Contabo, it must be an airway-only key, and this fallback must be removed.
//
// After a successful append the submission is handed to the Edith bridge
// (POST /airway): it renders the PDF, saves it to Drive, writes PDF link /
// status / sent-at back into the row matched by "Submitted ISO", and sends the
// ONE WhatsApp message per form to the "iSmile Airway Evaluations" group.
// Gated by AIRWAY_BRIDGE_ENABLED=1 until that bridge path is confirmed live.
//
// This is PATIENT PII + health information (a child's sleep and breathing):
//   - same safeguards as api/register.js: CORS allowlist, honeypot, per-IP
//     limit, valueInputOption=RAW, the body is NEVER logged
//   - NO message on success from here. A failure is alerted on Telegram only.
//
// Env vars: AIRWAY_SHEET_ID, AIRWAY_SHEET_TAB (default "Airway"),
// AIRWAY_SERVICE_ACCOUNT_JSON (optional; falls back to GOOGLE_SERVICE_ACCOUNT_JSON),
// AIRWAY_BRIDGE_ENABLED, EDITH_BRIDGE_URL / _TOKEN / _CA, TELEGRAM_BOT_TOKEN / _CHAT_ID.

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
// Dr Ling's consult questions (v3, 10 Oct 2026). Generated from
// Operations/Airway Questionnaire/tools/dl_questions.py — keep in step with it.
// [answer key, column header = the question as the parent saw it]
const DL_COLUMNS = [["dl_main","What is the main reason you are bringing your child to see us?"],["dl_c_growth","Do you have any concerns about your child's growth and development?"],["dl_c_growth_d","Please tell us more"],["dl_c_sleep","Any concerns about your child's sleep and breathing?"],["dl_c_sleep_d","Please tell us more"],["dl_c_mood","Any concerns about your child's mood and behaviour?"],["dl_c_mood_d","Please tell us more"],["dl_c_learn","Any concerns about how your child is learning or doing at school?"],["dl_c_learn_d","Please tell us more"],["dl_screen_h","On a usual day, how many hours does your child spend on screens (phone, tablet, TV, games)?"],["dl_screen_d","How many days a week?"],["dl_sleep_signs","During sleep, does your child usually… (tick all that apply)"],["dl_sleep_mouth","When asleep, your child's mouth is usually:"],["dl_sleep_pos","Your child usually sleeps:"],["dl_bedtime","Usual bedtime:"],["dl_sleep_hrs","Hours of sleep a night:"],["dl_fall_asleep","How long does it take to fall asleep?"],["dl_dry_throat","Does your child wake up with a dry or sore throat?"],["dl_focus","How is your child's focus and concentration?"],["dl_adhd","Has your child ever been diagnosed with ADHD or hyperactivity?"],["dl_focus_d","Anything you'd like to add about focus?"],["dl_ear","Has your child had ear infections, from baby until now?"],["dl_ear_d","How often, and at what age?"],["dl_nose_often","Does your child often have… (tick all that apply)"],["dl_treated","Has your child ever been treated for… (tick all that apply)"],["dl_surgery","Has your child had any of these operations?"],["dl_surgery_d","Which operation, and when?"],["dl_therapist","Has your child seen any of these, now or before?"],["dl_other_health","Any other health conditions or treatment we should know about?"],["dl_allergy","Does your child have… (tick all that apply)"],["dl_allergy_d","What sets it off?"],["dl_habits","At any age, has your child… (tick all that apply)"],["dl_habit_len1","Breathed through the mouth — how long"],["dl_habit_len2","Bitten or sucked the lips — how long"],["dl_habit_len3","Sucked a thumb or finger — how long"],["dl_habit_len4","Pushed the tongue against the teeth — how long"],["dl_habit_len5","Used a pacifier — how long"],["dl_habit_len6","Used a milk bottle — how long"],["dl_habit_len7","Bitten nails — how long"],["dl_habit_len8","Pushed the lower jaw forward — how long"],["dl_habit_len9","Sucked clothes or a blanket — how long"],["dl_food","Your child mostly eats:"],["dl_fussy","Is your child a fussy eater?"],["dl_meal_time","How long does a meal usually take?"],["dl_eat_style","When eating, your child:"],["dl_chew","Any trouble chewing or swallowing?"],["dl_sugar","How often does your child have sweet, processed or fast food?"],["dl_food_d","Anything to add about your child's eating?"],["dl_sport","Does your child do sports or physical activities?"],["dl_sport_d","Which ones?"],["dl_can_early","Can you answer questions about the pregnancy and birth?"],["dl_conceive","How was the pregnancy conceived?"],["dl_preg_issues","During the pregnancy, were there… (tick all that apply)"],["dl_preg_stress","Was there a lot of stress during the pregnancy (work, family, loss, accident)?"],["dl_preg_meds","Was any medicine taken during the pregnancy, other than pregnancy vitamins?"],["dl_preg_meds_d","Which medicine?"],["dl_preg_subst","Any alcohol or other substances during the pregnancy?"],["dl_preg_subst_d","Which?"],["dl_delivery","How was your child born?"],["dl_birth","At birth, were there… (tick all that apply)"],["dl_breast","Breastfed directly (latching) for:"],["dl_bottle","Bottle-fed for:"],["dl_feed_issue","Any feeding problems as a baby?"],["dl_feed_issue_d","What happened?"],["dl_tie","Was your child told they had a tongue tie or lip tie?"],["dl_tie_tx","Was it treated?"],["dl_head","As a baby, was the head shape normal?"],["dl_neck","As a baby, was there a stiff neck, head tilt or body tightness?"],["dl_tummy","Did your baby have plenty of tummy time and crawling?"],["dl_walk","Age when your child started walking:"],["dl_talk","Age when your child started talking:"],["dl_delay","Any delays in development?"],["dl_delay_d","What kind of delay?"],["dl_baby_sleep","After 3 months old, your baby usually:"],["dl_baby_signs","As a baby, were there… (tick all that apply)"],["dl_outdoor","As a young child, how much outdoor play and sunlight?"],["dl_order","Your child is the… in the family"],["dl_fam_teeth","Does anyone in the family have crooked teeth, bite or jaw problems?"],["dl_fam_teeth_d","Who, and what problem?"],["dl_fam_osa","Has anyone in the family been diagnosed with sleep apnoea?"],["dl_parent_allergy","Does either parent have nose or skin allergies?"]];
const DL_KEYS = DL_COLUMNS.map((c) => c[0]);
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
  ...ITEMS, ...DL_COLUMNS.map((c) => c[1]), 'Full JSON', 'PDF link', 'PDF status', 'PDF sent at',
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
  const dk = PSQ.length - answered;
  const noseRaw = nose / 5;
  return {
    psqYes: yes, psqNo: no, psqDk: dk, psqAnswered: answered,
    psqRatio: ratio, // unrounded (null when nothing answered Yes/No)
    psqPositive: ratio !== null && ratio >= 0.33,
    ess, nose, noseRaw, noseBand: band,
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

function buildRow(payload, sc, submittedIso) {
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
    filledByLabel(a),
    a.filledBy === 'The patient' ? '' : String(a.fillerName || '').trim(),
    String(a.mobile).trim(),
    a.doneBefore,
    sc.psqYes, sc.psqAnswered, sc.psqRatio === null ? '' : Math.round(sc.psqRatio * 100) / 100, sc.psqPositive ? 'Yes' : 'No',
    sc.ess, sc.nose, sc.noseBand,
    ...ITEMS.map((k) => a[k]),
    ...DL_KEYS.map((k) => (typeof a[k] === 'string' ? a[k].trim() : '')),
    fullJson.length > MAX_CELL ? JSON.stringify({ meta: m, _note: 'too large to store inline' }) : fullJson,
    '', '', '', // PDF link · PDF status · PDF sent at — filled by the Contabo PDF job
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
  const current = (head.data.values && head.data.values[0]) || [];
  if (current.length && current.indexOf(DL_COLUMNS[0][1]) < 0) {
    // One-time migration (v3): insert the consult-question columns just before
    // "Full JSON", so rows already in the tab keep their values under the right header.
    const at = current.indexOf('Full JSON');
    if (at < 0) throw new Error('Airway header has no "Full JSON" column');
    const meta2 = await client.request({ url: `${base}?fields=sheets.properties(sheetId,title)`, method: 'GET' });
    const sheet = meta2.data.sheets.find((x) => x.properties.title === TAB);
    await client.request({
      url: `${base}:batchUpdate`, method: 'POST',
      data: { requests: [{ insertDimension: { range: { sheetId: sheet.properties.sheetId, dimension: 'COLUMNS', startIndex: at, endIndex: at + DL_COLUMNS.length }, inheritFromBefore: true } }] },
    });
  }
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
      if (res.statusCode !== 202 && res.statusCode !== 200) console.error('Airway bridge hand-off status:', res.statusCode);
      res.on('end', resolve);
    });
    req.on('timeout', () => req.destroy(new Error('bridge timeout')));
    req.on('error', (err) => { console.error('Airway bridge hand-off failed:', err.message); resolve(); });
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

  const submittedIso = new Date(Date.parse((payload.meta || {}).submittedAt) || Date.now()).toISOString();

  try {
    await appendRow(buildRow(payload, sc, submittedIso));
  } catch (error) {
    console.error('Airway sheet append failed:', error.message);
    await notifyFailure([
      `⚠️ <b>Airway form NOT recorded</b> — ${esc(name)}`,
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
