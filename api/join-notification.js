// Vercel Serverless Function — Telegram Practitioner Enquiry Notification
// Receives the Join Us form submission and forwards it to the dedicated
// recruitment Telegram bot: one formatted message, plus the CV as a real
// document attachment when provided.
//
// Uses its OWN bot credentials (TELEGRAM_RECRUIT_BOT_TOKEN / TELEGRAM_RECRUIT_CHAT_ID)
// so recruitment stays independent of the booking-notification bot.

const BOT_TOKEN = process.env.TELEGRAM_RECRUIT_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_RECRUIT_CHAT_ID;

// Base64 inflates ~33%; Vercel's request cap is 4.5MB, so 3MB of raw file is safe.
const MAX_CV_BYTES = 3 * 1024 * 1024;

const escapeHtml = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing recruitment Telegram environment variables');
    return res.status(500).json({ error: 'Telegram not configured' });
  }

  const {
    name, phone, email, registration, currentPractice,
    currentStatus, lookingFor, about, cv, timestamp,
  } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing name or phone' });
  }

  const timeDisplay = new Date(timestamp || Date.now()).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const message = [
    '🩺 <b>New Practitioner Enquiry</b>',
    '',
    `👤 <b>Name:</b> ${escapeHtml(name)}`,
    `📞 <b>Phone:</b> ${escapeHtml(phone)}`,
    `📧 <b>Email:</b> ${escapeHtml(email) || '—'}`,
    `🎓 <b>Graduation / MDC:</b> ${escapeHtml(registration) || '—'}`,
    `🏥 <b>Practising now at:</b> ${escapeHtml(currentPractice) || '—'}`,
    `📌 <b>Current status:</b> ${escapeHtml(currentStatus) || '—'}`,
    `🔎 <b>Looking for:</b> ${escapeHtml(lookingFor) || '—'}`,
    '',
    '💬 <b>About them:</b>',
    escapeHtml(about) || '—',
    '',
    `📎 <b>CV:</b> ${cv && cv.base64 ? escapeHtml(cv.filename || 'attached below') : 'not provided'}`,
    `🕐 <b>Time:</b> ${timeDisplay} (MYT)`,
  ].join('\n');

  try {
    const sendMessage = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const messageResult = await sendMessage.json();

    if (!messageResult.ok) {
      console.error('Telegram sendMessage error:', messageResult);
      return res.status(200).json({ sent: false, error: messageResult.description });
    }

    // CV arrives as base64 JSON from the browser; forward it to Telegram as a
    // real document so it lands in the chat as a downloadable attachment.
    let cvSent = false;
    if (cv && cv.base64) {
      const bytes = Buffer.from(cv.base64, 'base64');
      if (bytes.length > 0 && bytes.length <= MAX_CV_BYTES) {
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('caption', `CV — ${name}`);
        form.append(
          'document',
          new Blob([bytes], { type: cv.mime || 'application/octet-stream' }),
          cv.filename || 'cv.pdf'
        );
        const sendDocument = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: form,
        });
        const documentResult = await sendDocument.json();
        cvSent = !!documentResult.ok;
        if (!documentResult.ok) console.error('Telegram sendDocument error:', documentResult);
      } else {
        console.error(`CV rejected: ${bytes.length} bytes`);
      }
    }

    return res.status(200).json({ sent: true, cvSent });
  } catch (error) {
    console.error('Failed to send recruitment notification:', error);
    return res.status(200).json({ sent: false, error: error.message });
  }
}
