/* eslint-disable @stylistic/js/indent */
import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('s2s', () => {
  const transport = process.env.S2S_TRANSPORT || 'REDIS';
  const options =
    transport === 'RABBITMQ'
      ? {
          urls: [process.env.S2S_RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.S2S_RABBITMQ_QUEUE || 'default_queue',
        }
      : {
          url: process.env.S2S_REDIS_URL || 'redis://localhost:6379',
        };

  return {
    transport: transport === 'RABBITMQ' ? Transport.RMQ : Transport.REDIS,
    options,
  };
});
