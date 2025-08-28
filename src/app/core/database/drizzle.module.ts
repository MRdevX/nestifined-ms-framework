import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  AuthorDrizzleRepository,
  BookDrizzleRepository,
  DrizzleDatabase,
  MigrationService,
  TokenDrizzleRepository,
  UserDrizzleRepository,
} from "./drizzle.exports";

@Global()
@Module({
  providers: [
    {
      provide: DrizzleDatabase,
      useFactory: (configService: ConfigService) => DrizzleDatabase.getInstance(configService),
      inject: [ConfigService],
    },
    MigrationService,
    AuthorDrizzleRepository,
    BookDrizzleRepository,
    UserDrizzleRepository,
    TokenDrizzleRepository,
  ],
  exports: [
    DrizzleDatabase,
    MigrationService,
    AuthorDrizzleRepository,
    BookDrizzleRepository,
    UserDrizzleRepository,
    TokenDrizzleRepository,
  ],
})
export class DrizzleModule {}
