import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not set');
}

export const redis = new Redis(process.env.REDIS_URL);

// Sliding window rate limiter
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 3600000 // 1 hour default
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Redis key for this rate limit
  const redisKey = `ratelimit:${key}`;

  // Remove old entries outside the window
  await redis.zremrangebyscore(redisKey, 0, windowStart);

  // Count current requests in window
  const currentCount = await redis.zcard(redisKey);

  if (currentCount >= limit) {
    // Get oldest entry to calculate reset time
    const oldest = await redis.zrange(redisKey, 0, 0, 'WITHSCORES');
    const resetMs = oldest.length > 0 ? parseInt(oldest[1]) + windowMs : now + windowMs;

    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil(resetMs / 1000), // Unix timestamp in seconds
    };
  }

  // Add current request
  await redis.zadd(redisKey, now, `${now}-${Math.random()}`);
  
  // Set TTL to window size
  await redis.expire(redisKey, Math.ceil(windowMs / 1000));

  return {
    allowed: true,
    remaining: limit - (currentCount + 1),
    reset: Math.ceil((now + windowMs) / 1000),
  };
}
