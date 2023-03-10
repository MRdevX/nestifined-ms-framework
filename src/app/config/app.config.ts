import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development' || 'staging' || 'production',
  name: process.env.APP_NAME,
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: process.env.CORS,
  apiPrefix: process.env.API_PREFIX || 'api',
  version: process.env.RELEASE || undefined,
}));
