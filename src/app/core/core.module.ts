import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import appConfig from "@root/app/config/app.config";
import authConfig from "@root/app/config/auth.config";
import dbConfig from "@root/app/config/db.config";
import redisConfig from "@root/app/config/redis.config";
import s2sConfig from "@root/app/config/s2s.config";
import sentryConfig from "@root/app/config/sentry.config";
import { graphqlConfig } from "../config";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database";
import { MessagingModule } from "./messaging/messaging.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, dbConfig, redisConfig, s2sConfig, sentryConfig],
      envFilePath: [".env"],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig,
    }),
    DatabaseModule.forRoot(),
    CacheModule,
    MessagingModule,
  ],
  exports: [CacheModule, MessagingModule],
})
export class CoreModule {}
