import Joi from 'joi';
import { registerAs } from '@nestjs/config';

export const sentryConfigSchema = Joi.object({
  SENTRY_DSN: Joi.string().uri().optional(),
});

export default registerAs('sentry', () => ({
  dsn: process.env.SENTRY_DSN || undefined,
}));
