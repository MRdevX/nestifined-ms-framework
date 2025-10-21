import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  },
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10,
  },
}));
