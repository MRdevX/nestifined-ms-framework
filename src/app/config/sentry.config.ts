import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const sentryConfigSchema = Joi.object({
  SENTRY_DSN: Joi.string().uri().optional(),
});

export default registerAs('sentry', () => ({
  dsn: process.env.SENTRY_DSN || undefined,
}));
