import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { TypeOrmDatabaseModule } from "./typeorm/typeorm.module";

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DrizzleModule],
    };
  }

  static forFeature(ormType?: string): DynamicModule {
    const configService = new ConfigService();
    const defaultOrm = configService.get<string>("app.orm", "drizzle");
    const selectedOrm = ormType || defaultOrm;

    const imports = [];

    if (selectedOrm.toLowerCase() === "drizzle") {
      imports.push(DrizzleModule);
    } else if (selectedOrm.toLowerCase() === "typeorm") {
      imports.push(TypeOrmDatabaseModule);
    }

    return {
      module: DatabaseModule,
      imports,
    };
  }
}
