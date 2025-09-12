import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    const authConfig = this.configService.get("auth");

    // TODO: Add password strength validation before hashing
    // TODO: Consider using Argon2 instead of bcrypt for better security
    // TODO: Add password history to prevent reuse

    return bcrypt.hash(password, authConfig.password.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    // TODO: Add timing attack protection
    // TODO: Consider adding password attempt logging

    return bcrypt.compare(password, hashedPassword);
  }
}
