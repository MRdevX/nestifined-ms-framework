import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = this.buildResetUrl(resetToken);

    this.logger.log(`Password reset email for ${email}: ${resetUrl}`);
  }

  private buildResetUrl(resetToken: string): string {
    const appConfig = this.configService.get("app");

    return `http://${appConfig.host}:${appConfig.port}/${appConfig.apiPrefix}/auth/reset-password?token=${resetToken}`;
  }
}
