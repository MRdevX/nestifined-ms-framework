import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import type { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import type { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { LoginDto } from "./dto/login.dto";
import type { RefreshTokenDto } from "./dto/refresh-token.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { ResetPasswordDto } from "./dto/reset-password.dto";
import type { AuthResponse, TokenPair, UserWithoutPassword } from "./interfaces/auth.interfaces";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";
import { TokensService } from "./tokens/tokens.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await this.passwordService.hash(password);

    const savedUser = await this.usersService.createWithPassword(email, hashedPassword, name);

    const tokens = this.tokensService.generateTokenPair(savedUser.id, savedUser.email);

    await this.tokenService.createRefreshToken(savedUser.id, tokens.refreshToken);

    const { password: _, ...userWithoutSensitiveData } = savedUser;

    // TODO: Send welcome email to new user
    // TODO: Add email verification requirement
    // TODO: Log user registration for analytics
    // TODO: Consider adding CAPTCHA for registration
    // TODO: Add password strength validation

    return {
      user: userWithoutSensitiveData as UserWithoutPassword,
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !user.password) {
      // TODO: Add rate limiting for failed login attempts
      // TODO: Log failed login attempts for security monitoring
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.passwordService.compare(password, user.password);
    if (!isPasswordValid) {
      // TODO: Add rate limiting for failed login attempts
      // TODO: Log failed login attempts for security monitoring
      throw new UnauthorizedException("Invalid credentials");
    }

    // TODO: Log successful login for analytics
    // TODO: Consider adding 2FA support
    // TODO: Check if user account is locked/suspended

    return this.loginWithUser(user);
  }

  async loginWithUser(user: User): Promise<AuthResponse> {
    const tokens = this.tokensService.generateTokenPair(user.id, user.email);

    await this.tokenService.createRefreshToken(user.id, tokens.refreshToken);

    const { password: _, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData as UserWithoutPassword,
      tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.deleteRefreshToken(userId);

    // TODO: Log user logout for analytics
    // TODO: Consider implementing "logout from all devices" functionality
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.tokensService.verifyRefreshToken(refreshToken);

      const tokenEntity = await this.tokenService.findRefreshToken(payload.sub, refreshToken);
      if (!tokenEntity || tokenEntity.isExpired()) {
        // TODO: Log suspicious refresh token usage
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = this.tokensService.generateTokenPair(payload.sub, payload.email);

      await this.tokenService.createRefreshToken(payload.sub, tokens.refreshToken);

      // TODO: Log token refresh for security monitoring
      // TODO: Consider implementing refresh token rotation

      return tokens;
    } catch (_error) {
      // TODO: Log refresh token verification failures
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: "If a user with this email exists, a password reset link has been sent" };
    }

    const resetToken = await this.tokenService.createPasswordResetToken(user.id);

    // TODO: Implement email service to send password reset link
    // TODO: Create email template for password reset
    // TODO: Add rate limiting for forgot password requests
    // TODO: Log password reset attempts for security monitoring
    // TODO: Consider adding email verification before allowing password reset

    return { message: "If a user with this email exists, a password reset link has been sent" };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    const resetTokenEntity = await this.tokenService.findPasswordResetToken(token);
    if (!resetTokenEntity || resetTokenEntity.isExpired()) {
      // TODO: Log invalid password reset attempts
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    const hashedPassword = await this.passwordService.hash(password);

    await this.usersService.updatePassword(resetTokenEntity.userId, hashedPassword);

    await this.tokenService.deletePasswordResetToken(resetTokenEntity.userId);

    // TODO: Invalidate all existing refresh tokens for security
    // TODO: Send confirmation email about password change
    // TODO: Log password reset completion

    return { message: "Password has been reset successfully" };
  }

  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (user?.password && (await this.passwordService.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result as UserWithoutPassword;
    }

    return null;
  }
}
