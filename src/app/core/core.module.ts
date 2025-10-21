import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "@root/app/config/app.config";
import authConfig from "@root/app/config/auth.config";
import dbConfig from "@root/app/config/db.config";
import redisConfig from "@root/app/config/redis.config";
import s2sConfig from "@root/app/config/s2s.config";
import sentryConfig from "@root/app/config/sentry.config";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database";
import { EmailModule } from "./email/email.module";
import { MessagingModule } from "./messaging/messaging.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, dbConfig, redisConfig, s2sConfig, sentryConfig],
      envFilePath: [".env"],
    }),
    DatabaseModule.forRoot(),
    CacheModule,
    EmailModule,
    MessagingModule,
  ],
  exports: [CacheModule, EmailModule, MessagingModule],
})
export class CoreModule {}
