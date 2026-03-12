/**
 * TheoSheets Email Signup API
 * Vercel serverless function — POST only
 * Sends notification to owner and welcome email to subscriber via Resend
 */

const path = require('path');
const { Resend } = require('resend');

// Load .env.local for local dev (vercel dev does not auto-load env files)
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Simple RFC 5322–compliant email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.EMAIL_TO;

  if (!apiKey || !emailFrom || !emailTo) {
    console.error('Missing required env: RESEND_API_KEY, EMAIL_FROM, or EMAIL_TO');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const email = (body?.email || '').trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  const resend = new Resend(apiKey);
  const idempotencyKey = `subscribe/${Date.now()}-${email.replace(/[^a-z0-9]/g, '')}`;

  // 1. Send notification email to owner
  const { error: notifyError } = await resend.emails.send({
    from: emailFrom,
    to: [emailTo],
    subject: 'New TheoSheets subscriber',
    html: `
      <p>A new subscriber has joined the TheoSheets early access list.</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    `,
    idempotencyKey: `${idempotencyKey}-notify`,
  });

  if (notifyError) {
    console.error('Notification email failed:', notifyError);
    // Continue — we still want to send the welcome email
  }

  // 2. Send welcome email to subscriber
  const { data, error: welcomeError } = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: "You're on the TheoSheets early access list",
    html: `
      <p>Thank you for joining the TheoSheets early access list.</p>
      <p>You're now among the founding subscribers—musicians who will be first to know when we launch and first to access our collection of premium scores, accompaniment tracks, and resources.</p>
      <p>As a founding subscriber, you will receive:</p>
      <ul>
        <li>A complimentary premium score</li>
        <li>Launch-only offers reserved for early subscribers</li>
        <li>First access to TheoSheets releases when the store opens</li>
      </ul>
      <p>We look forward to sharing more with you soon.</p>
    `,
    idempotencyKey: `${idempotencyKey}-welcome`,
  });

  if (welcomeError) {
    console.error('Welcome email failed:', welcomeError);
    return res.status(500).json({
      error: 'Unable to complete signup. Please try again later.',
    });
  }

  // Increment subscriber count in Redis (if configured)
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const { Redis } = require('@upstash/redis');
      const redis = Redis.fromEnv();
      await redis.incr('theosheets:subscriber_count');
    } catch (err) {
      console.error('Redis increment failed:', err);
    }
  }

  return res.status(200).json({ success: true, id: data?.id });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
