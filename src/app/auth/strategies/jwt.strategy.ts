import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import type { TokenPayload } from "../interfaces/auth.interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("auth.jwt.access.secret"),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return {
      id: user.id,
      email: user.email,
    };
  }
}
