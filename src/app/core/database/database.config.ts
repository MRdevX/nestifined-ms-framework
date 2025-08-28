import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  maxConnections?: number;
  ssl?:
    | {
        rejectUnauthorized?: boolean;
        ca?: string;
        key?: string;
        cert?: string;
      }
    | false;
}

export class DatabaseConfigFactory {
  static createPool(configService: ConfigService): Pool {
    const config = DatabaseConfigFactory.getConfig(configService);

    return new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: config.maxConnections || 100,
      ssl: config.ssl,
    });
  }

  static getConfig(configService: ConfigService): DatabaseConfig {
    return {
      host: configService.get("db.host"),
      port: configService.get("db.port"),
      user: configService.get("db.username"),
      password: configService.get("db.password"),
      database: configService.get("db.name"),
      maxConnections: configService.get("db.maxConnections") || 100,
      ssl: configService.get("db.sslEnabled")
        ? {
            rejectUnauthorized: configService.get("db.rejectUnauthorized"),
            ca: configService.get("db.ca"),
            key: configService.get("db.key"),
            cert: configService.get("db.cert"),
          }
        : false,
    };
  }
}
