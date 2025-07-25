import type { Context, Next } from "hono";
import { z } from '@hono/zod-openapi';
import { getRedisClient } from "../redis";

export type RateLimiterOptions = {
    windowMs: number,
    maxRequests: number,
    headerContent: boolean,
    redisKeyPrefix:  string,
};


const IpSchema = z.object({
    ip: z.ipv4()
});


export function rateLimiter(options: RateLimiterOptions) {
  return async (c: Context, next: Next) => {

    const redis = getRedisClient();
    
    const rawIp = c.req.header('x-forwarded-for');

    const result = IpSchema.safeParse({ ip: rawIp });

    if (!result.success) {
        console.warn(`Invalid IP format: ${rawIp}`);
        return c.json({ message: "Invalid IP address." }, 400);
    }
    
    const ip = result.data.ip;
    
     const key = `${options.redisKeyPrefix}:${ip}`;

    const now = Date.now();
    const ttlSeconds = Math.floor(options.windowMs / 1000);

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, ttlSeconds);
    }

    const ttl = await redis.ttl(key);

    if (options.headerContent) {
        c.header('X-RateLimit-Limit', options.maxRequests.toString());
        c.header('X-RateLimit-Remaining', Math.max(options.maxRequests - count, 0).toString());
        c.header('X-RateLimit-Reset', (now + ttl * 1000).toString());
    }

    await next();
  };
}