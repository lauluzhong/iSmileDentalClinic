// Vercel Serverless Function — Telegram Booking Notification
// Receives form submission data and sends a formatted message to Telegram

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing Telegram environment variables');
    return res.status(500).json({ error: 'Telegram not configured' });
  }

  const { name, contact, email, experience, sourcePage, timestamp } = req.body || {};

  // Validate required fields
  if (!name && !contact) {
    return res.status(400).json({ error: 'Missing name or contact' });
  }

  // Format the Telegram message
  const pageDisplay = sourcePage || 'Unknown page';
  const timeDisplay = timestamp ? new Date(timestamp).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const message = [
    '🦷 <b>New Booking Request</b>',
    '',
    `📋 <b>Name:</b> ${name || '—'}`,
    `📞 <b>Contact:</b> ${contact || '—'}`,
    `📧 <b>Email:</b> ${email || '—'}`,
    '',
    `💬 <b>Message:</b>`,
    experience ? experience : '—',
    '',
    `🌐 <b>Page:</b> ${pageDisplay}`,
    `🕐 <b>Time:</b> ${timeDisplay} (MYT)`,
  ].join('\n');

  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return res.status(200).json({ sent: false, error: result.description });
    }

    return res.status(200).json({ sent: true, messageId: result.result.message_id });

  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return res.status(200).json({ sent: false, error: error.message });
  }
}
