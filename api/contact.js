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
    return res.status(500).json({
      message: 'Mail service is not configured correctly',
      missingSettings
    });
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
      subject: `New enquiry: ${payload.subject}`,
      text: `New contact form submission\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
      html: `
        <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe5ef;border-radius:10px;overflow:hidden;">
            <div style="padding:24px 28px;background:#0f4c81;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.85;">SOFTVISIONXR</div>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:600;">New website enquiry</h1>
              <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">A visitor submitted the contact form.</p>
            </div>
            <div style="padding:28px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#0f2031;">Contact details</h2>
              <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="width:120px;padding:10px 12px;background:#f4f7fb;border-bottom:1px solid #e5edf5;font-weight:600;color:#52657a;">Name</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5edf5;">${escapeHtml(payload.name)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f4f7fb;border-bottom:1px solid #e5edf5;font-weight:600;color:#52657a;">Email</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5edf5;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0f4c81;">${escapeHtml(payload.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f4f7fb;border-bottom:1px solid #e5edf5;font-weight:600;color:#52657a;">Phone</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5edf5;">${escapeHtml(payload.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f4f7fb;font-weight:600;color:#52657a;">Subject</td>
                  <td style="padding:10px 12px;">${escapeHtml(payload.subject)}</td>
                </tr>
              </table>
              <h2 style="margin:28px 0 12px;font-size:18px;color:#0f2031;">Message</h2>
              <div style="padding:16px;background:#f8fafc;border-left:4px solid #14b8a6;border-radius:4px;line-height:1.7;font-size:15px;white-space:normal;">${escapeHtml(payload.message).replace(/\n/g, '<br>')}</div>
              <p style="margin:24px 0 0;font-size:13px;color:#52657a;">You can reply directly to this email to contact ${escapeHtml(payload.name)}.</p>
            </div>
            <div style="padding:16px 28px;background:#f4f7fb;border-top:1px solid #dbe5ef;color:#718096;font-size:12px;">
              Sent from the SOFTVISIONXR website contact form.
            </div>
          </div>
        </div>
      `
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact mail send failed:', error);
    return res.status(502).json({
      message: 'Unable to send your message right now',
      code: error && error.code ? error.code : 'SMTP_SEND_FAILED',
      responseCode: error && error.responseCode ? error.responseCode : undefined
    });
  }
};
