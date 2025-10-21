import { registerAs } from "@nestjs/config";

export default registerAs("rabbitmq", () => ({
  host: process.env.RABBITMQ_HOST || "localhost",
  port: parseInt(process.env.RABBITMQ_PORT, 10) || 5672,
  username: process.env.RABBITMQ_USER || "guest",
  password: process.env.RABBITMQ_PASSWORD || "guest",
  queue: process.env.RABBITMQ_QUEUE_NAME || "default_queue",
}));
