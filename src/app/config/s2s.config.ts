import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import Joi from 'joi';

export const s2sConfigSchema = Joi.object({
  S2S_TRANSPORT: Joi.number().default(Transport.REDIS),
  S2S_REDIS_URL: Joi.string().default('redis://localhost:6379'),
});

export default registerAs('s2s', () => ({
  transport: parseInt(process.env.S2S_TRANSPORT, 10) || Transport.REDIS,
  options: {
    url: process.env.S2S_REDIS_URL || 'redis://localhost:6379',
  },
}));
