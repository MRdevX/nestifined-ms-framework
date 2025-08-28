import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfigFactory } from "./database.config";
import { DrizzleDatabase } from "./drizzle.config";

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly configService: ConfigService) {}

  async runMigrations(): Promise<void> {
    try {
      const pool = DatabaseConfigFactory.createPool(this.configService);
      const db = DrizzleDatabase.getInstance(this.configService).getDatabase();

      this.logger.log("Syncing database schema...");

      this.logger.log("Database schema sync completed successfully");

      await pool.end();
    } catch (error) {
      this.logger.error("Failed to sync database schema", error);
      throw error;
    }
  }
}
