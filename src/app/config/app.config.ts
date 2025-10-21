import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3030,
  host: process.env.HOST || "127.0.0.1",
  env: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "api",
  name: process.env.APP_NAME || "NestifinedMSFramework",
  cors: process.env.CORS === "true",
}));
