import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class MessagingService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqConfig = this.configService.get("rabbitmq");

    if (rabbitmqConfig) {
      this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@${rabbitmqConfig.host}:${rabbitmqConfig.port}`,
          ],
          queue: rabbitmqConfig.queue,
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
