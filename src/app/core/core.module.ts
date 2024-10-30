import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import sentryConfig from '@root/app/config/sentry.config';
import appConfig from '@root/app/config/app.config';
import dbConfig from '@root/app/config/db.config';
import s2sConfig from '@root/app/config/s2s.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { CacheModule } from './cache/cache.module';
import { MessagingModule } from './messaging/messaging.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, s2sConfig, sentryConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CacheModule,
    MessagingModule,
  ],
  exports: [CacheModule, MessagingModule],
})
export class CoreModule {}
