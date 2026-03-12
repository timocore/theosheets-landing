/**
 * One-off script to reset subscriber count in Upstash Redis.
 * Run: node scripts/reset-count.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const REDIS_KEY = 'theosheets:subscriber_count';
const NEW_COUNT = 1;

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env.local');
    process.exit(1);
  }

  const { Redis } = require('@upstash/redis');
  const redis = new Redis({ url, token });
  await redis.set(REDIS_KEY, NEW_COUNT);
  console.log(`Reset ${REDIS_KEY} to ${NEW_COUNT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
