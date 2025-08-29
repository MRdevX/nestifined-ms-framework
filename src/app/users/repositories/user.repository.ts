import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { TypeOrmBaseRepository } from "../../core/database/base/base.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class UserRepository extends TypeOrmBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      select: ["id", "email", "name", "password", "createdAt", "updatedAt"],
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
    await this.repository.update(userId, { password: hashedPassword });
    return this.findById(userId);
  }
}
