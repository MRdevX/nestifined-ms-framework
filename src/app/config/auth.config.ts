import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  jwt: {
    access: {
      secret:
        process.env.JWT_ACCESS_SECRET ||
        (() => {
          if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_ACCESS_SECRET must be defined in production");
          }
          return "dev-access-secret-change-in-production";
        })(),
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    },
    refresh: {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        (() => {
          if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_REFRESH_SECRET must be defined in production");
          }
          return "dev-refresh-secret-change-in-production";
        })(),
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  },
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10,
  },
  reset: {
    expiresIn: parseInt(process.env.PASSWORD_RESET_EXPIRES_IN, 10) || 3600000,
  },
}));
