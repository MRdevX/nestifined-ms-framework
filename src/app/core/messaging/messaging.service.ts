import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type ClientProxy, ClientProxyFactory } from "@nestjs/microservices";

@Injectable()
export class MessagingService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    const microservicesConfig = this.configService.get("config.microservices");

    if (microservicesConfig?.options) {
      this.client = ClientProxyFactory.create({
        transport: microservicesConfig.transport,
        options: {
          ...microservicesConfig.options,
          queueOptions: {
            durable: false,
          },
        },
      });
    }
  }

  getClient(): ClientProxy | undefined {
    return this.client;
  }
}
