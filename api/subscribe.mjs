/**
 * TheoSheets Email Signup API
 * Vercel serverless function — POST only
 * Stores subscribers in Upstash. Sends branded founding-list welcome email.
 * Uses inlined WELCOME_EMAIL_HTML (no file I/O). Resend contact sync disabled.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { WELCOME_EMAIL_HTML, WELCOME_EMAIL_TEXT } from './welcome-email-template.mjs';
import { Resend } from 'resend';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Simple RFC 5322–compliant email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBSCRIBER_COUNT_KEY = 'theosheets:subscriber_count';
const SUBSCRIBER_EMAILS_KEY = 'theosheets:subscriber_emails';
const UNSUBSCRIBE_TOKEN_PREFIX = 'theosheets:unsubscribe:';

function getLandingBaseUrl() {
  if (process.env.LANDING_URL) return process.env.LANDING_URL.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : 'http://localhost:3000';
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error('Missing required env: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const email = normalizeEmail(body?.email || '');
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  const { Redis } = await import('@upstash/redis');
  const redis = Redis.fromEnv();
  const subscriberKey = getSubscriberKey(email);
  const now = new Date().toISOString();
  let subscriber = null;
  let spotNumber = null;
  let isNew = false;

  try {
    const existing = await redis.get(subscriberKey);

    if (typeof existing === 'string') {
      subscriber = parseStoredSubscriber(existing);
    } else if (existing && typeof existing === 'object') {
      subscriber = existing;
    }

    if (!subscriber) {
      spotNumber = await redis.incr(SUBSCRIBER_COUNT_KEY);
      const unsubscribeToken = crypto.randomBytes(24).toString('hex');
      subscriber = {
        email,
        created_at: now,
        spot_number: spotNumber,
        founding_musician_eligible: true,
        unsubscribe_token: unsubscribeToken,
      };

      await redis.set(subscriberKey, JSON.stringify(subscriber));
      await redis.set(`${UNSUBSCRIBE_TOKEN_PREFIX}${unsubscribeToken}`, email, { ex: 60 * 60 * 24 * 365 }); // 1 year TTL
      await redis.sadd(SUBSCRIBER_EMAILS_KEY, email);
      isNew = true;
    } else {
      spotNumber = Number(subscriber.spot_number) || null;

      if (subscriber.founding_musician_eligible !== true) {
        subscriber.founding_musician_eligible = true;
        await redis.set(subscriberKey, JSON.stringify(subscriber));
      }
      if (!subscriber.unsubscribe_token) {
        const unsubscribeToken = crypto.randomBytes(24).toString('hex');
        subscriber.unsubscribe_token = unsubscribeToken;
        await redis.set(subscriberKey, JSON.stringify(subscriber));
        await redis.set(`${UNSUBSCRIBE_TOKEN_PREFIX}${unsubscribeToken}`, email, { ex: 60 * 60 * 24 * 365 });
      }
    }
  } catch (err) {
    console.error('Upstash subscriber save failed:', err);
    return res.status(500).json({ error: 'Unable to process signup right now.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const resend = new Resend(apiKey);
  const idempotencyKey = `subscribe/${Date.now()}-${email.replace(/[^a-z0-9]/g, '')}`;

  // NOTE: Resend contact sync is disabled here. Adding contacts to Resend Audience
  // can trigger an automatic welcome email (configured in Resend dashboard). We send
  // our own welcome-email.html instead. To sync contacts for Broadcasts, add them
  // manually or re-enable after disabling any Resend automations.

  if (isNew && apiKey && emailFrom) {
    try {
      const baseUrl = getLandingBaseUrl();
      const token = subscriber?.unsubscribe_token || crypto.randomBytes(24).toString('hex');
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`;

      const html = WELCOME_EMAIL_HTML.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);
      const text = WELCOME_EMAIL_TEXT.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);

      if (!html || html.length < 100) {
        console.error('Welcome email HTML invalid or empty, aborting send');
      } else {
        const { error: welcomeError } = await resend.emails.send({
          from: emailFrom,
          to: [email],
          subject: "You're on the TheoSheets founding list",
          html,
          text,
          idempotencyKey: `${idempotencyKey}-welcome`,
        });

        if (welcomeError) {
          console.error('Welcome email failed:', JSON.stringify(welcomeError, null, 2));
        }
      }
    } catch (err) {
      console.error('Welcome email failed:', err);
    }
  } else if (isNew) {
    console.warn('Skipping welcome email: RESEND_API_KEY or EMAIL_FROM is not configured');
  }

  return res.status(200).json({ success: true, isNew });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function getSubscriberKey(email) {
  return `theosheets:subscriber:${email}`;
}

function parseStoredSubscriber(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
