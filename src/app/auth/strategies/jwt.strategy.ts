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
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
