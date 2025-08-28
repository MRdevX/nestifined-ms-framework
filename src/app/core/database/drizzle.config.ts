import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./drizzle.schema";

export class DrizzleDatabase {
  private static instance: DrizzleDatabase;
  private db: ReturnType<typeof drizzle>;

  private constructor(configService: ConfigService) {
    const pool = new Pool({
      host: configService.get("db.host"),
      port: configService.get("db.port"),
      user: configService.get("db.username"),
      password: configService.get("db.password"),
      database: configService.get("db.name"),
      max: configService.get("db.maxConnections") || 100,
      ssl: configService.get("db.sslEnabled")
        ? {
            rejectUnauthorized: configService.get("db.rejectUnauthorized"),
            ca: configService.get("db.ca"),
            key: configService.get("db.key"),
            cert: configService.get("db.cert"),
          }
        : false,
    });

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
