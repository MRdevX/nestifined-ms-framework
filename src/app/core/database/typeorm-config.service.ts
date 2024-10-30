import * as fs from 'fs';
import { DataSourceOptions } from 'typeorm';
import { set } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { entities } from './entities';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): DataSourceOptions {
    const dbSettings: DataSourceOptions = {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB_NAME'),
      synchronize: true,
      migrationsRun: false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      entities,
      // logging: this.configService.get<string>('NODE_ENV') !== 'production',
      extra: {
        max: this.configService.get<number>('DB_MAX_CONNECTIONS') || 100,
      },
    };

    if (this.configService.get<boolean>('DB_SSL_ENABLED')) {
      set(dbSettings, 'ssl', {
        rejectUnauthorized: this.configService.get<boolean>('DB_REJECT_UNAUTHORIZED'),
        ca: this.configService.get<string>('DB_CA')
          ? fs.readFileSync(this.configService.get<string>('DB_CA')).toString()
          : undefined,
        key: this.configService.get<string>('DB_KEY')
          ? fs.readFileSync(this.configService.get<string>('DB_KEY')).toString()
          : undefined,
        cert: this.configService.get<string>('DB_CERT')
          ? fs.readFileSync(this.configService.get<string>('DB_CERT')).toString()
          : undefined,
      });
    }

    return dbSettings;
  }
}
