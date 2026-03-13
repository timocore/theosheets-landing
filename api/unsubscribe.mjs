/**
 * TheoSheets Unsubscribe API
 * GET /api/unsubscribe?token=xxx
 * Marks a subscriber as unsubscribed in Redis and redirects to the landing page.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUBSCRIBER_KEY_PREFIX = 'theosheets:subscriber:';
const UNSUBSCRIBE_TOKEN_PREFIX = 'theosheets:unsubscribe:';
function getLandingBaseUrl() {
  if (process.env.LANDING_URL) return process.env.LANDING_URL.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : 'http://localhost:3000';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : null;
  if (!token) {
    return res.redirect(302, `${getLandingBaseUrl()}/?unsubscribed=invalid`);
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    return res.redirect(302, `${getLandingBaseUrl()}/?unsubscribed=error`);
  }

  try {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();

    const email = await redis.get(`${UNSUBSCRIBE_TOKEN_PREFIX}${token}`);
    if (!email || typeof email !== 'string') {
      return res.redirect(302, `${getLandingBaseUrl()}/?unsubscribed=invalid`);
    }

    const subscriberKey = `${SUBSCRIBER_KEY_PREFIX}${email}`;
    const existing = await redis.get(subscriberKey);
    let subscriber = null;
    if (typeof existing === 'string') {
      try {
        subscriber = JSON.parse(existing);
      } catch {}
    } else if (existing && typeof existing === 'object') {
      subscriber = existing;
    }

    if (subscriber) {
      subscriber.unsubscribed = true;
      subscriber.unsubscribed_at = new Date().toISOString();
      await redis.set(subscriberKey, JSON.stringify(subscriber));
    }

    await redis.del(`${UNSUBSCRIBE_TOKEN_PREFIX}${token}`);
    return res.redirect(302, `${getLandingBaseUrl()}/?unsubscribed=ok`);
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.redirect(302, `${getLandingBaseUrl()}/?unsubscribed=error`);
  }
}
