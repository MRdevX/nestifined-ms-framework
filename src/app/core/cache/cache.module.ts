import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from '../../config/redis.config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
