import { Injectable, Inject, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setKey(key: string, value: string, number?: number): Promise<void> {
    await this.redisClient.set(key, value);
    await this.redisClient.expire(key, number || 600);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
