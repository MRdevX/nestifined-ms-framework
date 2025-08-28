import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '../../core/base/typeorm/typeorm.base.repository';
import { Token, type TokenType } from '../entities/token.entity';

@Injectable()
export class TokenRepository extends TypeOrmBaseRepository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }

  async findByUserIdAndType(userId: string, type: TokenType): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { userId, type },
    });
  }

  async findByTokenAndType(token: string, type: TokenType): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { token, type },
    });
  }

  async findByUserIdTokenAndType(userId: string, token: string, type: TokenType): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { userId, token, type },
    });
  }

  async deleteByUserIdAndType(userId: string, type: TokenType): Promise<boolean> {
    const result = await this.tokenRepository.delete({ userId, type });
    return (result.affected || 0) > 0;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.createQueryBuilder().delete().where('expiresAt < :now', { now: new Date() }).execute();
  }
}
