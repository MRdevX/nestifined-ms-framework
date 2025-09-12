import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import type { UserWithoutPassword } from "../interfaces/auth.interfaces";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // TODO: Add rate limiting for failed login attempts
      // TODO: Log failed login attempts with IP address
      throw new UnauthorizedException();
    }

    // TODO: Check if user account is locked/suspended
    // TODO: Add device fingerprinting for security

    return user;
  }
}
