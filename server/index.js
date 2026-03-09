const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:4200';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

function validateContactPayload(payload) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;

  if (!payload || typeof payload !== 'object') {
    return ['Invalid payload'];
  }

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!payload.email || !emailRegex.test(payload.email.trim())) {
    errors.push('A valid email is required');
  }

  if (!payload.subject || payload.subject.trim().length < 4) {
    errors.push('Subject must be at least 4 characters long');
  }

  if (!payload.message || payload.message.trim().length < 20) {
    errors.push('Message must be at least 20 characters long');
  }

  if (payload.phone && !phoneRegex.test(payload.phone.trim())) {
    errors.push('Phone format is invalid');
  }

  return errors;
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
  const errors = validateContactPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromName = process.env.CONTACT_FROM_NAME || 'Website Contact Form';

  if (!toEmail || !process.env.MAIL_USER || !process.env.MAIL_PASS || !process.env.MAIL_HOST) {
    return res.status(500).json({ message: 'Mail service is not configured correctly' });
  }

  const payload = {
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone ? req.body.phone.trim() : 'Not provided',
    subject: req.body.subject.trim(),
    message: req.body.message.trim()
  };

  const transporter = buildTransporter();

  const mail = {
    from: `"${fromName}" <${process.env.MAIL_USER}>`,
    to: toEmail,
    replyTo: payload.email,
    subject: `[Website Contact] ${payload.subject}`,
    text: `New contact form submission\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Subject:</strong> ${payload.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mail);
    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact mail send failed:', error);
    return res.status(500).json({ message: 'Unable to send your message right now' });
  }
});

app.listen(port, () => {
  console.log(`Contact API running on http://localhost:${port}`);
});
