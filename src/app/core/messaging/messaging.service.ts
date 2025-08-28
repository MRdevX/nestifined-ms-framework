import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { type ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('S2S_RABBITMQ_URL')],
        queue: this.configService.get<string>('S2S_RABBITMQ_QUEUE'),
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
