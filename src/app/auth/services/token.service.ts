import { randomBytes } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Token, TokenType } from "../entities/token.entity";
import { TokenRepository } from "../repositories/token.repository";

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(userId: string, token: string): Promise<Token> {
    const authConfig = this.configService.get("auth");
    const refreshTokenExpiry = new Date(Date.now() + this.parseDuration(authConfig.jwt.refresh.expiresIn));

    const existingToken = await this.tokenRepository.findByUserIdAndType(userId, TokenType.REFRESH);

    if (existingToken) {
      return this.tokenRepository.update(existingToken.id, {
        token,
        expiresAt: refreshTokenExpiry,
      });
    } else {
      return this.tokenRepository.create({
        userId,
        token,
        type: TokenType.REFRESH,
        expiresAt: refreshTokenExpiry,
      });
    }
  }

  async createPasswordResetToken(userId: string): Promise<Token> {
    const resetToken = randomBytes(32).toString("hex");
    const authConfig = this.configService.get("auth");
    const expiresAt = new Date(Date.now() + authConfig.reset.expiresIn);

    const existingToken = await this.tokenRepository.findByUserIdAndType(userId, TokenType.PASSWORD_RESET);

    if (existingToken) {
      return this.tokenRepository.update(existingToken.id, {
        token: resetToken,
        expiresAt,
      });
    } else {
      return this.tokenRepository.create({
        userId,
        token: resetToken,
        type: TokenType.PASSWORD_RESET,
        expiresAt,
      });
    }
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
