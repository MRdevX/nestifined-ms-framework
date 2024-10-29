import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig, { appConfigSchema } from '../config/app.config';
import dbConfig, { dbConfigSchema } from '../config/db.config';
import s2sConfig, { s2sConfigSchema } from '../config/s2s.config';
import sentryConfig, { sentryConfigSchema } from '../config/sentry.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, s2sConfig, sentryConfig],
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        ...appConfigSchema.describe().keys,
        ...dbConfigSchema.describe().keys,
        ...s2sConfigSchema.describe().keys,
        ...sentryConfigSchema.describe().keys,
      }),
    }),
  ],
})
export class CoreModule {}
