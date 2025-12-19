import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async getString(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async setString(
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<void> {
    if (ttlSeconds <= 0) {
      return;
    }

    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
