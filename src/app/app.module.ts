import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import s2sConfig from './config/s2s.config';
import sentryConfig from './config/sentry.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, s2sConfig, sentryConfig],
      envFilePath: ['.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
