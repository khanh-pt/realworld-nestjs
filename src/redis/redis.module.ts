import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AllConfigType } from '@/config/config.type';
import redisConfig from '@/config/redis.config';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const redisOptions = configService.getOrThrow('redis', { infer: true });

        return new Redis({
          host: redisOptions.host,
          port: redisOptions.port,
          username: redisOptions.username,
          password: redisOptions.password,
          keyPrefix: redisOptions.keyPrefix,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
