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
    const baseUrl = this.configService.get("app.host");
    const port = this.configService.get("app.port");
    const apiPrefix = this.configService.get("app.apiPrefix");

    return `http://${baseUrl}:${port}/${apiPrefix}/auth/reset-password?token=${resetToken}`;
  }
}
