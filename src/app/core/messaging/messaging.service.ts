import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

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
