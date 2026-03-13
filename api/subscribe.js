/**
 * TheoSheets Email Signup API
 * Vercel serverless function — POST only
 * Stores subscribers in Upstash. Sends branded founding-list welcome email.
 * Template inlined here to avoid .mjs import/bundling issues on Vercel.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { Resend } from 'resend';
import dotenv from 'dotenv';

const WELCOME_EMAIL_TEXT = `TheoSheets
Expressive Piano Editions

Welcome to the TheoSheets Founding List

Thank you for joining the TheoSheets founding list.

Your place is confirmed, and you are now part of the early circle of musicians who will receive first access when the TheoSheets collection is released.

Founding Members Will Receive:
- Early access to the collection
- A complimentary premium score
- Lifetime Founding Musician recognition on TheoSheets

Thank you for joining before launch. It means a great deal to begin in the company of musicians who care about expressive, carefully crafted editions.

With thanks,
Theo Timoc
Composer & Creator of TheoSheets

We'll only send occasional updates about the TheoSheets launch.

Unsubscribe: {{UNSUBSCRIBE_URL}}

TheoSheets Founding List Marker: V3`;

const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>You're on the TheoSheets founding list</title>
    <style>
      @media only screen and (max-width: 640px) {
        .email-shell { width: 100% !important; }
        .email-padding { padding-left: 28px !important; padding-right: 28px !important; }
        .brand-name { font-size: 30px !important; line-height: 36px !important; }
        .hero-title { font-size: 30px !important; line-height: 38px !important; }
        .body-copy, .list-copy, .signature-copy, .footer-copy { font-size: 16px !important; line-height: 28px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f1e8; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all">Founding members will receive a complimentary premium score and lifetime recognition on TheoSheets.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #f6f1e8">
      <tr><td align="center" style="padding: 40px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620" class="email-shell" style="width: 620px; max-width: 620px; border-collapse: collapse">
          <tr><td class="email-padding" style="padding: 56px 56px 52px 56px; background-color: #fbf8f2; border: 1px solid #e7dece;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse">
              <tr><td align="center" class="brand-name" style="padding: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 36px; line-height: 42px; color: #5f4a36; letter-spacing: 0.2px; font-weight: normal;">TheoSheets</td></tr>
              <tr><td align="center" style="padding: 0 0 24px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 18px; color: #9a7a53; letter-spacing: 2.4px; text-transform: uppercase;">Expressive Piano Editions</td></tr>
              <tr><td align="center" style="padding: 0 0 32px 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="88" style="width: 88px; border-collapse: collapse"><tr><td style="height: 1px; line-height: 1px; font-size: 1px; background-color: #cbb187;">&nbsp;</td></tr></table></td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse">
              <tr><td align="center" class="hero-title" style="padding: 0 0 22px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 36px; line-height: 44px; color: #241d16; font-weight: normal;">Welcome to the TheoSheets Founding List</td></tr>
              <tr><td align="center" class="body-copy" style="padding: 0 0 22px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 30px; color: #4a4036;">Thank you for joining the TheoSheets founding list.</td></tr>
              <tr><td align="center" class="body-copy" style="padding: 0 0 28px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 30px; color: #4a4036;">Your place is confirmed, and you are now part of the early circle of musicians who will receive first access when the TheoSheets collection is released.</td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse">
              <tr><td align="center" style="padding: 0 0 14px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 24px; color: #8c7550; letter-spacing: 1.4px; text-transform: uppercase;">Founding Members Will Receive</td></tr>
              <tr><td align="center" style="padding: 0 0 8px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                  <tr><td align="center" class="list-copy" style="padding: 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 29px; color: #2f2821;">Early access to the collection</td></tr>
                  <tr><td align="center" class="list-copy" style="padding: 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 29px; color: #2f2821;">A complimentary premium score</td></tr>
                  <tr><td align="center" class="list-copy" style="padding: 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 29px; color: #2f2821;">Lifetime Founding Musician recognition on TheoSheets</td></tr>
                </table>
              </td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse">
              <tr><td align="center" style="padding: 34px 0 0 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="72" style="width: 72px; border-collapse: collapse"><tr><td style="height: 1px; line-height: 1px; font-size: 1px; background-color: #e1d4bf;">&nbsp;</td></tr></table></td></tr>
              <tr><td align="center" class="body-copy" style="padding: 34px 0 22px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 30px; color: #4a4036;">Thank you for joining before launch. It means a great deal to begin in the company of musicians who care about expressive, carefully crafted editions.</td></tr>
              <tr><td align="center" class="signature-copy" style="padding: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 30px; color: #2c241d;">With thanks,</td></tr>
              <tr><td align="center" class="signature-copy" style="padding: 10px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; line-height: 32px; color: #201a14;">Theo Timoc</td></tr>
              <tr><td align="center" class="footer-copy" style="padding: 2px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 24px; color: #7a6956;">Composer &amp; Creator of TheoSheets</td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse">
              <tr><td align="center" class="footer-copy" style="padding: 38px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; line-height: 24px; color: #8a7b69;">We&rsquo;ll only send occasional updates about the TheoSheets launch.</td></tr>
              <tr><td align="center" style="padding: 12px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 20px; color: #9b8b77;"><a href="{{UNSUBSCRIBE_URL}}" style="color: #9b8b77; text-decoration: underline;">Unsubscribe</a></td></tr>
              <tr><td align="center" style="padding: 18px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; line-height: 18px; color: #9b8b77;">TheoSheets Founding List Marker: V3</td></tr>
            </table>
          </td></tr>
          <tr><td align="center" style="padding: 18px 24px 0 24px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 20px; color: #9b8b77;">TheoSheets &middot; Expressive Piano Editions</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

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
  console.log('[subscribe] Request received:', req.method);
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
      await redis.set(`${UNSUBSCRIBE_TOKEN_PREFIX}${unsubscribeToken}`, email, { ex: 60 * 60 * 24 * 365 });
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

  if (isNew && apiKey && emailFrom) {
    try {
      const baseUrl = getLandingBaseUrl();
      const token = subscriber?.unsubscribe_token || crypto.randomBytes(24).toString('hex');
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`;

      const html = WELCOME_EMAIL_HTML.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);
      const text = WELCOME_EMAIL_TEXT.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);

      // Debug: verify we're sending the premium HTML (not fallback)
      const htmlValid = html && html.length > 100 && html.startsWith('<!DOCTYPE');
      console.log('[subscribe] Welcome email: html length=', html?.length ?? 0, 'htmlValid=', htmlValid, 'startsWith=', html?.substring(0, 50));

      if (!htmlValid) {
        console.error('[subscribe] Welcome email HTML invalid or empty, aborting send');
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
          console.error('[subscribe] Welcome email failed:', JSON.stringify(welcomeError, null, 2));
        } else {
          console.log('[subscribe] Welcome email sent successfully to', email);
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
