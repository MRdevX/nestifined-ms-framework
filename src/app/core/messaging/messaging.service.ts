import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type ClientProxy, ClientProxyFactory } from "@nestjs/microservices";

@Injectable()
export class MessagingService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    const s2sConfig = this.configService.get("s2s");
    this.client = ClientProxyFactory.create({
      transport: s2sConfig.transport,
      options: {
        ...s2sConfig.options,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
