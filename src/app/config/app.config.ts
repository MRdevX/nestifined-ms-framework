import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const appConfigSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  APP_NAME: Joi.string().default('MyApp'),
  HOST: Joi.string().default('127.0.0.1'),
  PORT: Joi.number().default(3000),
  CORS: Joi.boolean().default(true),
  API_PREFIX: Joi.string().default('api'),
  RELEASE: Joi.string().default('1.0.0'),
});

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME,
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: process.env.CORS === 'true',
  apiPrefix: process.env.API_PREFIX || 'api',
  version: process.env.RELEASE || undefined,
}));
