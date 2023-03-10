import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: process.env.DB_HOST || 'localhost',
  type: process.env.DB_TYPE,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  name: process.env.DB_NAME || 'demo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  sync: process.env.DB_SYNC || false,
  logging: process.env.DB_LOGGING || false,
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
  sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
}));
