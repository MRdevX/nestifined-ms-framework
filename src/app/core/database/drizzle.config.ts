import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { DatabaseConfigFactory } from "./database.config";
import * as schema from "./drizzle.schema";

export class DrizzleDatabase {
  private static instance: DrizzleDatabase;
  private db: ReturnType<typeof drizzle>;

  private constructor(configService: ConfigService) {
    const pool = DatabaseConfigFactory.createPool(configService);
    this.db = drizzle(pool, { schema });
  }

  static getInstance(configService: ConfigService): DrizzleDatabase {
    if (!DrizzleDatabase.instance) {
      DrizzleDatabase.instance = new DrizzleDatabase(configService);
    }
    return DrizzleDatabase.instance;
  }

  getDatabase() {
    return this.db;
  }

  getSchema() {
    return schema;
  }
}

export type Database = ReturnType<typeof drizzle>;
