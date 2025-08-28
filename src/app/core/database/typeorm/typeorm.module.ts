import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MigrationService } from "./migration.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("db.host"),
        port: configService.get("db.port"),
        username: configService.get("db.username"),
        password: configService.get("db.password"),
        database: configService.get("db.name"),
        entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
        synchronize: configService.get("db.synchronize", false),
        logging: configService.get("db.logging", false),
        ssl: configService.get("db.sslEnabled")
          ? {
              rejectUnauthorized: configService.get("db.rejectUnauthorized"),
              ca: configService.get("db.ca"),
              key: configService.get("db.key"),
              cert: configService.get("db.cert"),
            }
          : false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MigrationService],
  exports: [MigrationService],
})
export class TypeOrmDatabaseModule {}
