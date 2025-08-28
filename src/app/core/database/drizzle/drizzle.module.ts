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
      provide: "DATABASE",
      useFactory: (configService: ConfigService) => {
        const drizzleDb = DrizzleDatabase.getInstance(configService);
        return drizzleDb.getDatabase();
      },
      inject: [ConfigService],
    },
    MigrationService,
  ],
  exports: ["DATABASE", MigrationService],
})
export class DrizzleModule {}
