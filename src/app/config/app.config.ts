import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export const appConfigSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),
  APP_NAME: Joi.string().default('MyApp'),
  HOST: Joi.string().default('127.0.0.1'),
  PORT: Joi.number().default(3000),
  CORS: Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.string(),
      Joi.array().items(Joi.string(), Joi.object().instance(RegExp)),
      Joi.object({
        origin: Joi.alternatives().try(
          Joi.boolean(),
          Joi.string(),
          Joi.object().instance(RegExp),
          Joi.array().items(Joi.string(), Joi.object().instance(RegExp)),
          Joi.function(),
        ),
        methods: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
        allowedHeaders: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
        exposedHeaders: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
        credentials: Joi.boolean(),
        maxAge: Joi.number(),
        preflightContinue: Joi.boolean(),
        optionsSuccessStatus: Joi.number(),
      }),
    )
    .default(true),
  API_PREFIX: Joi.string().default('api'),
  RELEASE: Joi.string().default('1.0.0'),
});

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME,
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: (() => {
    const corsConfig = process.env.CORS;
    try {
      return JSON.parse(corsConfig);
    } catch {
      return corsConfig === 'true';
    }
  })(),
  apiPrefix: process.env.API_PREFIX || 'api',
  version: process.env.RELEASE || undefined,
}));
