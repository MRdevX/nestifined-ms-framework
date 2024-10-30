import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME,
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT, 10) || 3030,
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
