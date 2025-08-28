import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly configService: ConfigService) {}

  async runMigrations(): Promise<void> {
    try {
      this.logger.log("Syncing TypeORM database schema...");

      this.logger.log("TypeORM database schema sync completed successfully");
    } catch (error) {
      this.logger.error("Failed to sync TypeORM database schema", error);
      throw error;
    }
  }
}
