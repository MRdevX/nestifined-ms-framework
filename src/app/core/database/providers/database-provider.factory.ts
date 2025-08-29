import { Injectable } from "@nestjs/common";
import { DatabaseProvider } from "../interfaces/database.interface";
import { TypeOrmProvider } from "./typeorm.provider";

export type DatabaseType = "typeorm" | "prisma" | "drizzle";

@Injectable()
export class DatabaseProviderFactory {
  createProvider(type: DatabaseType, config: any): DatabaseProvider {
    switch (type) {
      case "typeorm":
        return new TypeOrmProvider(config);
      case "prisma":
        throw new Error("Prisma provider not implemented yet");
      case "drizzle":
        throw new Error("Drizzle provider not implemented yet");
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}
