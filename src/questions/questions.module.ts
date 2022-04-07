import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './question.model';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Question]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
