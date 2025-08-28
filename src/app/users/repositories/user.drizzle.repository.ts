import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DrizzleBaseRepository } from "../../core/base/drizzle/drizzle.base.repository";
import type { DrizzleUser } from "../../core/base/drizzle/drizzle.entities";
import type { Database } from "../../core/database/drizzle.config";
import { users } from "../../core/database/drizzle.schema";

@Injectable()
export class UserDrizzleRepository extends DrizzleBaseRepository<DrizzleUser> {
  constructor(db: Database) {
    super(db, users);
  }

  async findByEmail(email: string): Promise<DrizzleUser | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    return (result[0] as DrizzleUser) || null;
  }

  async findByEmailWithPassword(email: string): Promise<DrizzleUser | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    return (result[0] as DrizzleUser) || null;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<boolean> {
    const result = await this.db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return result.rowCount > 0;
  }
}
