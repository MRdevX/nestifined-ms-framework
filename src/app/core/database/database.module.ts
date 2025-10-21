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
          useFactory: (configService: ConfigService) => {
            const dbConfig = configService.get("database");
            return {
              type: "postgres",
              host: config?.host || dbConfig.host,
              port: config?.port || dbConfig.port,
              username: config?.username || dbConfig.username,
              password: config?.password || dbConfig.password,
              database: config?.database || dbConfig.database,
              synchronize: config?.synchronize ?? dbConfig.synchronize,
              entities,
              logging: configService.get("app.env") !== "production",
            };
          },
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
