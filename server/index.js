const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const demoAdminEmail = (process.env.DEMO_ADMIN_EMAIL || 'admin@softvisionxr.com').trim().toLowerCase();
const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD || 'Admin@123';
const googleOAuthClient = googleClientId ? new OAuth2Client(googleClientId) : null;
const googleAllowedAdminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const dataDirectory = path.join(__dirname, 'data');
const adminUsersFilePath = path.join(dataDirectory, 'admin-users.json');

const seededUsers = [
  {
    name: 'Sanket Bhuwad',
    email: 'sanketbhuwad.personal@gmail.com',
    role: 'admin',
    status: 'active',
    lastLogin: 'Seeded user'
  },
  {
    name: 'Akash Patil',
    email: 'akash.patil@gmail.com',
    role: 'viewer',
    status: 'active',
    lastLogin: 'Seeded user'
  }
];

function ensureDataDirectory() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
}

function loadAdminUsers() {
  ensureDataDirectory();

  if (!fs.existsSync(adminUsersFilePath)) {
    fs.writeFileSync(adminUsersFilePath, JSON.stringify(seededUsers, null, 2));
    return [...seededUsers];
  }

  try {
    const raw = fs.readFileSync(adminUsersFilePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [...seededUsers];
    }

    return parsed;
  } catch {
    return [...seededUsers];
  }
}

function saveAdminUsers(users) {
  ensureDataDirectory();
  fs.writeFileSync(adminUsersFilePath, JSON.stringify(users, null, 2));
}

const adminUsers = loadAdminUsers();
const authSessions = new Map();

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (curl/health checks/server-to-server).
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    }
  })
);
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

function buildGoogleSessionUser(payload, role) {
  const email = (payload.email || '').trim().toLowerCase();

  return {
    email,
    role,
    token: crypto.randomBytes(32).toString('hex'),
    expiresAt: (payload.exp ? Number(payload.exp) : Math.floor(Date.now() / 1000) + 60 * 60 * 8) * 1000,
    displayName: payload.name || email,
    avatarUrl: payload.picture,
    provider: 'google'
  };
}

function buildDemoSessionUser(email) {
  return {
    email,
    role: 'admin',
    token: crypto.randomBytes(32).toString('hex'),
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    displayName: 'Admin User',
    provider: 'password'
  };
}

function getNowLabel() {
  return new Date().toLocaleString();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function upsertAdminUserFromGooglePayload(payload, role) {
  const email = normalizeEmail(payload.email);
  const existingIndex = adminUsers.findIndex((user) => user.email === email);
  const record = {
    name: payload.name || email,
    email,
    role,
    status: 'active',
    lastLogin: getNowLabel()
  };

  if (existingIndex >= 0) {
    adminUsers[existingIndex] = {
      ...adminUsers[existingIndex],
      name: record.name,
      role,
      lastLogin: record.lastLogin
    };
    saveAdminUsers(adminUsers);
    return;
  }

  adminUsers.push(record);
  saveAdminUsers(adminUsers);
}

function registerSession(user) {
  authSessions.set(user.token, {
    email: user.email,
    role: user.role,
    expiresAt: user.expiresAt
  });
}

function getAuthTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return '';
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return '';
  }

  return parts[1];
}

function requireAuth(req, res, next) {
  const token = getAuthTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token.' });
  }

  const session = authSessions.get(token);
  if (!session) {
    return res.status(401).json({ message: 'Session is invalid or expired. Please login again.' });
  }

  if (session.expiresAt <= Date.now()) {
    authSessions.delete(token);
    return res.status(401).json({ message: 'Session has expired. Please login again.' });
  }

  req.authUser = session;
  return next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.authUser) {
      return res.status(401).json({ message: 'Unauthorized request.' });
    }

    const rank = {
      viewer: 1,
      admin: 2
    };

    if (rank[req.authUser.role] < rank[role]) {
      return res.status(403).json({ message: 'You do not have permission for this action.' });
    }

    return next();
  };
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/google', async (req, res) => {
  if (!googleOAuthClient || !googleClientId) {
    return res.status(500).json({
      message: 'Google auth is not configured on server.'
    });
  }

  const idToken = typeof req.body?.idToken === 'string' ? req.body.idToken : '';

  if (!idToken) {
    return res.status(400).json({ message: 'Google credential token is required.' });
  }

  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
      audience: googleClientId
    });

    const payload = ticket.getPayload();
    const email = payload?.email ? payload.email.trim().toLowerCase() : '';
    const emailVerified = payload?.email_verified === true;

    if (!email || !emailVerified) {
      return res.status(401).json({
        message: 'Google account verification failed. Please use a verified Google account.'
      });
    }

    const hasAdminAllowlist = googleAllowedAdminEmails.length > 0;
    const role = hasAdminAllowlist && !googleAllowedAdminEmails.includes(email) ? 'viewer' : 'admin';

    upsertAdminUserFromGooglePayload(payload, role);
    const user = buildGoogleSessionUser(payload, role);
    registerSession(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Google auth verification failed:', error);
    return res.status(401).json({
      message: 'Unable to verify Google login. Please try again.'
    });
  }
});

app.post('/api/auth/demo', (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (email !== demoAdminEmail || password !== demoAdminPassword) {
    return res.status(401).json({ message: 'Invalid credentials. Please check email and password.' });
  }

  const user = buildDemoSessionUser(email);
  registerSession(user);
  return res.status(200).json(user);
});

app.get('/api/admin/users', requireAuth, requireRole('viewer'), (_, res) => {
  const users = [...adminUsers].sort((a, b) => a.email.localeCompare(b.email));
  return res.status(200).json(users);
});

app.patch('/api/admin/users/:email', requireAuth, requireRole('admin'), (req, res) => {
  const email = normalizeEmail(req.params.email);
  const user = adminUsers.find((item) => item.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const requestedRole = req.body?.role;
  const requestedStatus = req.body?.status;

  if (requestedRole && requestedRole !== 'admin' && requestedRole !== 'viewer') {
    return res.status(400).json({ message: 'Invalid role value.' });
  }

  if (requestedStatus && requestedStatus !== 'active' && requestedStatus !== 'suspended') {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  if (requestedRole) {
    user.role = requestedRole;
  }

  if (requestedStatus) {
    user.status = requestedStatus;
  }

  saveAdminUsers(adminUsers);

  return res.status(200).json(user);
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
