import { Injectable, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class CacheService implements OnModuleInit {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisConfig = this.configService.get("redis");

    if (redisConfig) {
      this.client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password,
      });
    }
  }

  getClient(): Redis | undefined {
    return this.client;
  }
}
