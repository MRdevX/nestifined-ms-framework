import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const dbConfigSchema = Joi.object({
  DB_URL: Joi.string().optional(),
  DB_TYPE: Joi.string().optional(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_MAX_CONNECTIONS: Joi.number().default(100),
  DB_SSL_ENABLED: Joi.boolean().default(false),
  DB_REJECT_UNAUTHORIZED: Joi.boolean().default(true),
  DB_CA: Joi.string().optional(),
  DB_KEY: Joi.string().optional(),
  DB_CERT: Joi.string().optional(),
});

export default registerAs('db', () => ({
  url: process.env.DB_URL,
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS, 10) || 100,
  sslEnabled: process.env.DB_SSL_ENABLED === 'true',
  rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true',
  ca: process.env.DB_CA,
  key: process.env.DB_KEY,
  cert: process.env.DB_CERT,
}));
