import { Injectable } from "@nestjs/common";
import type { BaseModel } from "../base.entity";
import { baseFields } from "./drizzle.base.entity";
import { DrizzleBaseRepository, type DrizzleDatabase } from "./drizzle.base.repository";

export interface User extends BaseModel {
  name: string;
  email: string;
  age?: number;
}

export const usersTable = {
  ...baseFields,
  name: "name",
  email: "email",
  age: "age",
} as const;

@Injectable()
export class UserDrizzleRepository extends DrizzleBaseRepository<User> {
  constructor(db: DrizzleDatabase) {
    super(db, usersTable);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.select().from(this.table).where(this.table.email.eq(email)).limit(1);
    return (result[0] as User) || null;
  }

  async findAdults(): Promise<User[]> {
    const result = await this.db.select().from(this.table).where(this.table.age.gte(18));
    return result as User[];
  }
}

@Injectable()
export class UserService {
  constructor(private readonly repository: UserDrizzleRepository) {}

  async create(data: Partial<User>): Promise<User> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.repository.update(id, data);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findAdults(): Promise<User[]> {
    return this.repository.findAdults();
  }
}
