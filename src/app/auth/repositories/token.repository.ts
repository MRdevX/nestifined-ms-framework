import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { TypeOrmBaseRepository } from "../../core/database/base/base.repository";
import { Token, TokenType } from "../entities/token.entity";

@Injectable()
export class TokenRepository extends TypeOrmBaseRepository<Token> {
  constructor(
    @InjectRepository(Token)
    repository: Repository<Token>,
  ) {
    super(repository);
  }

  async findByToken(token: string): Promise<Token | null> {
    return this.repository.findOne({
      where: { token },
    });
  }

  async findByUserIdAndType(userId: string, type: TokenType): Promise<Token | null> {
    return this.repository.findOne({
      where: { userId, type },
    });
  }

  async findByTokenAndType(token: string, type: TokenType): Promise<Token | null> {
    return this.repository.findOne({
      where: { token, type },
    });
  }

  async findByUserIdTokenAndType(userId: string, token: string, type: TokenType): Promise<Token | null> {
    return this.repository.findOne({
      where: { userId, token, type },
    });
  }

  async deleteByUserIdAndType(userId: string, type: TokenType): Promise<boolean> {
    const result = await this.repository.delete({ userId, type });
    return (result.affected || 0) > 0;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.repository.createQueryBuilder().delete().where("expiresAt < :now", { now: new Date() }).execute();
  }
}
