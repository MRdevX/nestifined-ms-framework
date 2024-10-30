/* eslint-disable @stylistic/js/indent */
import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const s2sConfigSchema = Joi.object({
  S2S_TRANSPORT: Joi.string().valid('REDIS', 'RABBITMQ').default('REDIS'),
  S2S_RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
  S2S_RABBITMQ_QUEUE: Joi.string().default('default_queue'),
});

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
