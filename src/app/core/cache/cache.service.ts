import Redis from 'ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService implements OnModuleInit {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('redis.host');
    const port = this.configService.get<number>('redis.port');
    const username = this.configService.get<string>('redis.username');
    const password = this.configService.get<string>('redis.password');
    this.client = new Redis({ host, port, username, password });
  }

  getClient(): Redis {
    return this.client;
  }
}
