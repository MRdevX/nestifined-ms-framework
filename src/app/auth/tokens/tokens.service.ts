import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { TokenPair, TokenPayload } from "../interfaces/auth.interfaces";

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateTokenPair(userId: string, email: string): TokenPair {
    const accessToken = this.generateAccessToken(userId, email);
    const refreshToken = this.generateRefreshToken(userId, email);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(userId: string, email: string): string {
    const payload: TokenPayload = {
      sub: userId,
      email,
      type: "access",
    };

    const authConfig = this.configService.get("auth");
    return this.jwtService.sign(payload, {
      secret: authConfig.jwt.access.secret,
      expiresIn: authConfig.jwt.access.expiresIn,
    });
  }

  generateRefreshToken(userId: string, email: string): string {
    const payload: TokenPayload = {
      sub: userId,
      email,
      type: "refresh",
    };

    const authConfig = this.configService.get("auth");
    return this.jwtService.sign(payload, {
      secret: authConfig.jwt.refresh.secret,
      expiresIn: authConfig.jwt.refresh.expiresIn,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    const authConfig = this.configService.get("auth");
    return this.jwtService.verify<TokenPayload>(token, {
      secret: authConfig.jwt.access.secret,
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    const authConfig = this.configService.get("auth");
    return this.jwtService.verify<TokenPayload>(token, {
      secret: authConfig.jwt.refresh.secret,
    });
  }

  decodeToken(token: string): TokenPayload {
    return this.jwtService.decode<TokenPayload>(token);
  }
}
