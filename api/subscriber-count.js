/**
 * TheoSheets Subscriber Count API
 * GET /api/subscriber-count
 * Returns the current founding subscriber count for the progress indicator.
 * Requires Upstash Redis (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const FOUNDING_LIMIT = 300;
const REDIS_KEY = 'theosheets:subscriber_count';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(200).json({ count: 84, limit: FOUNDING_LIMIT, source: 'fallback' });
  }

  try {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    const count = await redis.get(REDIS_KEY);
    const num = typeof count === 'number' ? count : parseInt(String(count || '0'), 10) || 0;

    return res.status(200).json({
      count: Math.min(num, FOUNDING_LIMIT),
      limit: FOUNDING_LIMIT,
      full: num >= FOUNDING_LIMIT,
      source: 'redis',
    });
  } catch (err) {
    console.error('Subscriber count error:', err);
    return res.status(200).json({ count: 84, limit: FOUNDING_LIMIT, source: 'fallback' });
  }
}
