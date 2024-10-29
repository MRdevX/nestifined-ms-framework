import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sentryConfig from '@root/app/config/sentry.config';
import appConfig from '@root/app/config/app.config';
import dbConfig from '@root/app/config/db.config';
import s2sConfig from '@root/app/config/s2s.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, s2sConfig, sentryConfig],
      envFilePath: ['.env'],
      // validationSchema: Joi.object({
      //   ...appConfigSchema.describe().keys,
      //   ...dbConfigSchema.describe().keys,
      //   ...s2sConfigSchema.describe().keys,
      //   ...sentryConfigSchema.describe().keys,
      // }),
    }),
  ],
})
export class CoreModule {}
