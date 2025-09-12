import { randomBytes } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { type Token, TokenType } from "../entities/token.entity";
import type { TokenRepository } from "../repositories/token.repository";

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(userId: string, token: string): Promise<Token> {
    await this.tokenRepository.deleteByUserIdAndType(userId, TokenType.REFRESH);

    const authConfig = this.configService.get("auth");
    const refreshTokenExpiry = new Date(Date.now() + this.parseDuration(authConfig.jwt.refresh.expiresIn));

    // TODO: Add device/session tracking for refresh tokens
    // TODO: Consider implementing refresh token rotation
    // TODO: Add IP address tracking for security

    return this.tokenRepository.create({
      userId,
      token,
      type: TokenType.REFRESH,
      expiresAt: refreshTokenExpiry,
    });
  }

  async createPasswordResetToken(userId: string): Promise<Token> {
    await this.tokenRepository.deleteByUserIdAndType(userId, TokenType.PASSWORD_RESET);

    const resetToken = randomBytes(32).toString("hex");
    const authConfig = this.configService.get("auth");
    const expiresAt = new Date(Date.now() + authConfig.reset.expiresIn);

    // TODO: Add rate limiting for password reset token creation
    // TODO: Log password reset token creation for security monitoring
    // TODO: Consider adding IP address tracking

    return this.tokenRepository.create({
      userId,
      token: resetToken,
      type: TokenType.PASSWORD_RESET,
      expiresAt,
    });
  }

  async findRefreshToken(userId: string, token: string): Promise<Token | null> {
    return this.tokenRepository.findByUserIdTokenAndType(userId, token, TokenType.REFRESH);
  }

  async findPasswordResetToken(token: string): Promise<Token | null> {
    return this.tokenRepository.findByTokenAndType(token, TokenType.PASSWORD_RESET);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.tokenRepository.deleteByUserIdAndType(userId, TokenType.REFRESH);
  }

  async deletePasswordResetToken(userId: string): Promise<void> {
    await this.tokenRepository.deleteByUserIdAndType(userId, TokenType.PASSWORD_RESET);
  }

  async cleanupExpiredTokens(): Promise<void> {
    // TODO: Add logging for cleanup operations
    // TODO: Consider adding metrics for cleanup performance
    // TODO: Add error handling for cleanup failures

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
