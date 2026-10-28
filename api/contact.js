const nodemailer = require('nodemailer');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s()-]{8,20}$/;

function validatePayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Invalid payload'];
  }

  if (typeof payload.name !== 'string' || payload.name.trim().length < 2 || payload.name.trim().length > 80) {
    errors.push('Name must be between 2 and 80 characters');
  }
  if (typeof payload.email !== 'string' || !emailPattern.test(payload.email.trim())) {
    errors.push('A valid email is required');
  }
  if (typeof payload.subject !== 'string' || payload.subject.trim().length < 4 || payload.subject.trim().length > 120) {
    errors.push('Subject must be between 4 and 120 characters');
  }
  if (typeof payload.message !== 'string' || payload.message.trim().length < 20 || payload.message.trim().length > 2000) {
    errors.push('Message must be between 20 and 2000 characters');
  }
  if (payload.phone && (typeof payload.phone !== 'string' || !phonePattern.test(payload.phone.trim()))) {
    errors.push('Phone format is invalid');
  }

  return errors;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const errors = validatePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const requiredSettings = ['MAIL_HOST', 'MAIL_USER', 'MAIL_PASS', 'CONTACT_TO_EMAIL'];
  const missingSettings = requiredSettings.filter((setting) => !process.env[setting]);
  if (missingSettings.length > 0) {
    console.error('Contact mail configuration is incomplete:', missingSettings.join(', '));
    return res.status(500).json({ message: 'Mail service is not configured correctly' });
  }

  const payload = {
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone ? req.body.phone.trim() : 'Not provided',
    subject: req.body.subject.trim(),
    message: req.body.message.trim()
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER.trim(),
      pass: process.env.MAIL_PASS.replace(/\s/g, '')
    }
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.CONTACT_FROM_NAME || 'Website Contact Form'}" <${process.env.MAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: payload.email,
      subject: `[Website Contact] ${payload.subject}`,
      text: `New contact form submission\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p>
      `
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact mail send failed:', error);
    try {
      const fallbackResponse = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(process.env.CONTACT_TO_EMAIL)}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            name: payload.name,
            email: payload.email,
            _replyto: payload.email,
            phone: payload.phone,
            subject: payload.subject,
            message: payload.message,
            _subject: `[Website Contact] ${payload.subject}`,
            _captcha: 'false',
            _template: 'table'
          })
        }
      );
      const fallbackResult = await fallbackResponse.json();

      if (fallbackResponse.ok && fallbackResult.success !== false && fallbackResult.success !== 'false') {
        return res.status(200).json({
          message: 'Message sent successfully. We will get back to you soon.'
        });
      }

      console.error('Contact fallback send failed:', fallbackResult);
    } catch (fallbackError) {
      console.error('Contact fallback request failed:', fallbackError);
    }

    return res.status(502).json({ message: 'Unable to send your message right now' });
  }
};
