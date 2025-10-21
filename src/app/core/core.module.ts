import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig, authConfig, databaseConfig, rabbitmqConfig, redisConfig } from "../config";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database";
import { EmailModule } from "./email/email.module";
import { MessagingModule } from "./messaging/messaging.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, redisConfig, rabbitmqConfig],
      envFilePath: ".env",
    }),
    DatabaseModule.forRoot(),
    CacheModule,
    EmailModule,
    MessagingModule,
  ],
  exports: [CacheModule, EmailModule, MessagingModule],
})
export class CoreModule {}
