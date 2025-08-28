import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenDrizzleRepository } from "../../auth/repositories/token.drizzle.repository";
import { AuthorDrizzleRepository } from "../../author/repositories/author.drizzle.repository";
import { BookDrizzleRepository } from "../../book/repositories/book.drizzle.repository";
import { UserDrizzleRepository } from "../../users/repositories/user.drizzle.repository";
import { DrizzleDatabase } from "./drizzle.config";
import { MigrationService } from "./migration.service";

@Global()
@Module({
  providers: [
    {
      provide: DrizzleDatabase,
      useFactory: (configService: ConfigService) => {
        return DrizzleDatabase.getInstance(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: "DATABASE",
      useFactory: (drizzleDb: DrizzleDatabase) => {
        return drizzleDb.getDatabase();
      },
      inject: [DrizzleDatabase],
    },
    MigrationService,
    AuthorDrizzleRepository,
    BookDrizzleRepository,
    UserDrizzleRepository,
    TokenDrizzleRepository,
  ],
  exports: [
    DrizzleDatabase,
    "DATABASE",
    MigrationService,
    AuthorDrizzleRepository,
    BookDrizzleRepository,
    UserDrizzleRepository,
    TokenDrizzleRepository,
  ],
})
export class DrizzleModule {}
