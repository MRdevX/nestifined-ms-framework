import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "@root/app/config/app.config";
import authConfig from "@root/app/config/auth.config";
import dbConfig from "@root/app/config/db.config";
import redisConfig from "@root/app/config/redis.config";
import s2sConfig from "@root/app/config/s2s.config";
import sentryConfig from "@root/app/config/sentry.config";
import { CacheModule } from "./cache/cache.module";
import { entities } from "./database/entities";
import { MessagingModule } from "./messaging/messaging.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, dbConfig, redisConfig, s2sConfig, sentryConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("db.host"),
        port: configService.get("db.port"),
        username: configService.get("db.username"),
        password: configService.get("db.password"),
        database: configService.get("db.name"),
        synchronize: configService.get("db.synchronize"),
        entities,
        logging: configService.get("NODE_ENV") !== "production",
        extra: {
          max: configService.get("db.maxConnections") || 100,
        },
      }),
    }),
    CacheModule,
    MessagingModule,
  ],
  exports: [CacheModule, MessagingModule],
})
export class CoreModule {}
