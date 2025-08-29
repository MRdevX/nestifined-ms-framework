import { DataSource } from "typeorm";
import { DatabaseProvider } from "../interfaces/database.interface";

export class TypeOrmProvider implements DatabaseProvider {
  private dataSource: DataSource;

  constructor(private config: any) {
    this.dataSource = new DataSource(config);
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
