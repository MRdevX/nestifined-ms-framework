import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';
import { PermissionsGuard } from './guards/permissions.guard';
import { TokenRepository } from './repositories/token.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), PassportModule, ConfigModule, TokensModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PasswordService,
    TokenRepository,
    JwtStrategy,
    LocalStrategy,
    PermissionsGuard,
  ],
  exports: [AuthService, TokenService, PermissionsGuard],
})
export class AuthModule {}
