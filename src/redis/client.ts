import type { Redis } from 'ioredis';

let redisClient: Redis;

export function setRedisClient(client: Redis) {
  redisClient = client;
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call setRedisClient() first.");
  }
  return redisClient;
}
