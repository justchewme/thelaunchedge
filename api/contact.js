const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const esc = (v) => String(v || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const { name, email, dial, phone, message } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'The Launch Edge <onboarding@resend.dev>',
      to: 'justchewme@gmail.com',
      replyTo: email,
      subject: `New intro request from ${String(name).slice(0, 80)}`,
      html: `
        <div style="font-family: monospace; font-size: 14px; color: #0F1714; max-width: 600px; margin: 0 auto; padding: 32px;">
          <p style="font-size: 20px; margin: 0 0 24px;"><strong>New intro request — The Launch Edge</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD; color: #5A5F5C; width: 140px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD;">${esc(name)}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD; color: #5A5F5C;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD;">${esc(email)}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD; color: #5A5F5C;">WhatsApp</td><td style="padding: 10px 0; border-bottom: 1px solid #E2DCCD;">${esc(dial)} ${esc(phone)}</td></tr>
            <tr><td style="padding: 10px 0; color: #5A5F5C; vertical-align: top;">Situation</td><td style="padding: 10px 0;">${esc(message) || '—'}</td></tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
};
