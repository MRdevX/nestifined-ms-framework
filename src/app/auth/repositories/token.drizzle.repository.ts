import { Inject, Injectable } from "@nestjs/common";
import { and, eq, lt } from "drizzle-orm";
import { DrizzleBaseRepository } from "../../core/base/drizzle/drizzle.base.repository";
import type { DrizzleToken } from "../../core/base/drizzle/drizzle.entities";
import type { Database } from "../../core/database/drizzle.config";
import { tokens } from "../../core/database/drizzle.schema";

export type TokenType = "ACCESS" | "REFRESH" | "RESET_PASSWORD" | "VERIFY_EMAIL";

@Injectable()
export class TokenDrizzleRepository extends DrizzleBaseRepository<DrizzleToken> {
  constructor(@Inject("DATABASE") db: Database) {
    super(db, tokens);
  }

  async findByUserIdAndType(userId: string, type: string): Promise<DrizzleToken | null> {
    const result = await this.db
      .select()
      .from(tokens)
      .where(and(eq(tokens.userId, userId), eq(tokens.type, type)))
      .limit(1);

    return (result[0] as DrizzleToken) || null;
  }

  async findByTokenAndType(token: string, type: string): Promise<DrizzleToken | null> {
    const result = await this.db
      .select()
      .from(tokens)
      .where(and(eq(tokens.token, token), eq(tokens.type, type)))
      .limit(1);

    return (result[0] as DrizzleToken) || null;
  }

  async findByUserIdTokenAndType(userId: string, token: string, type: string): Promise<DrizzleToken | null> {
    const result = await this.db
      .select()
      .from(tokens)
      .where(and(eq(tokens.userId, userId), eq(tokens.token, token), eq(tokens.type, type)))
      .limit(1);

    return (result[0] as DrizzleToken) || null;
  }

  async deleteByUserIdAndType(userId: string, type: string): Promise<boolean> {
    const result = await this.db.delete(tokens).where(and(eq(tokens.userId, userId), eq(tokens.type, type)));
    return result.rowCount > 0;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.db.delete(tokens).where(lt(tokens.expiresAt, new Date()));
  }
}
