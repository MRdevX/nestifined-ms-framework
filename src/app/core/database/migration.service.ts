import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { DrizzleDatabase } from "./drizzle.config";

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly configService: ConfigService) {}

  async runMigrations(): Promise<void> {
    try {
      const pool = new Pool({
        host: this.configService.get("db.host"),
        port: this.configService.get("db.port"),
        user: this.configService.get("db.username"),
        password: this.configService.get("db.password"),
        database: this.configService.get("db.name"),
        max: this.configService.get("db.maxConnections") || 100,
        ssl: this.configService.get("db.sslEnabled")
          ? {
              rejectUnauthorized: this.configService.get("db.rejectUnauthorized"),
              ca: this.configService.get("db.ca"),
              key: this.configService.get("db.key"),
              cert: this.configService.get("db.cert"),
            }
          : false,
      });

      const db = DrizzleDatabase.getInstance(this.configService).getDatabase();

      this.logger.log("Running database migrations...");
      await migrate(db, { migrationsFolder: "./src/migrations" });
      this.logger.log("Database migrations completed successfully");

      await pool.end();
    } catch (error) {
      this.logger.error("Failed to run migrations", error);
      throw error;
    }
  }
}
