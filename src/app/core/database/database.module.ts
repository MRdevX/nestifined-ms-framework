import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseService } from "./database.service";
import { entities } from "./entities";
import { DatabaseConfig } from "./interfaces/database.interface";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config?: Partial<DatabaseConfig>): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: "postgres",
            host: config?.host || configService.get("db.host"),
            port: config?.port || configService.get("db.port"),
            username: config?.username || configService.get("db.username"),
            password: config?.password || configService.get("db.password"),
            database: config?.database || configService.get("db.name"),
            synchronize: config?.synchronize ?? configService.get("db.synchronize"),
            entities,
            logging: configService.get("NODE_ENV") !== "production",
            extra: {
              max: config?.maxConnections || configService.get("db.maxConnections") || 100,
            },
          }),
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
