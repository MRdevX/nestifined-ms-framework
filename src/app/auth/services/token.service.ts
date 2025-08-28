import { randomBytes } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { DrizzleToken } from "../../core/base/drizzle/drizzle.entities";
import type { TokenDrizzleRepository } from "../repositories/token.drizzle.repository";

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenDrizzleRepository,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(userId: string, token: string): Promise<DrizzleToken> {
    await this.tokenRepository.deleteByUserIdAndType(userId, "REFRESH");

    const authConfig = this.configService.get("auth");
    const refreshTokenExpiry = new Date(Date.now() + this.parseDuration(authConfig.jwt.refresh.expiresIn));

    return this.tokenRepository.create({
      userId,
      token,
      type: "REFRESH",
      expiresAt: refreshTokenExpiry,
    });
  }

  async createPasswordResetToken(userId: string): Promise<DrizzleToken> {
    await this.tokenRepository.deleteByUserIdAndType(userId, "PASSWORD_RESET");

    const resetToken = randomBytes(32).toString("hex");
    const authConfig = this.configService.get("auth");
    const expiresAt = new Date(Date.now() + authConfig.reset.expiresIn);

    return this.tokenRepository.create({
      userId,
      token: resetToken,
      type: "PASSWORD_RESET",
      expiresAt,
    });
  }

  async findRefreshToken(userId: string, token: string): Promise<DrizzleToken | null> {
    return this.tokenRepository.findByUserIdTokenAndType(userId, token, "REFRESH");
  }

  async findPasswordResetToken(token: string): Promise<DrizzleToken | null> {
    return this.tokenRepository.findByTokenAndType(token, "PASSWORD_RESET");
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.tokenRepository.deleteByUserIdAndType(userId, "REFRESH");
  }

  async deletePasswordResetToken(userId: string): Promise<void> {
    await this.tokenRepository.deleteByUserIdAndType(userId, "PASSWORD_RESET");
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.cleanupExpiredTokens();
  }

  private parseDuration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return parseInt(duration, 10);
    }
  }
}
