import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('s2s', () => ({
  transport: Transport.RMQ,
  options: {
    urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:56001`],
    queue: process.env.RABBITMQ_QUEUE_NAME || 'default_queue',
  },
}));
