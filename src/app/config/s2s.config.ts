import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('s2s', () => ({
  transport: parseInt(process.env.S2S_TRANSPORT, 10) || Transport.REDIS,
  options: {
    url: process.env.S2S_REDIS_URL || 'redis://localhost:6379',
  },
}));
