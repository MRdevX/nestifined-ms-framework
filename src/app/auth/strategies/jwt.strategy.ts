import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { TokenPayload } from "../interfaces/auth.interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("auth.jwt.access.secret"),
    });
  }

  async validate(payload: TokenPayload) {
    // TODO: Add user existence validation from database
    // TODO: Check if user account is still active/locked
    // TODO: Add user role/permissions to the returned object
    // TODO: Consider adding token blacklist check

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
