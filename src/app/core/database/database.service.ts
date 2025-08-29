import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseProvider } from "./interfaces/database.interface";

@Injectable()
export class DatabaseService implements DatabaseProvider, OnModuleInit, OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  isConnected(): boolean {
    return this.dataSource.isInitialized;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
