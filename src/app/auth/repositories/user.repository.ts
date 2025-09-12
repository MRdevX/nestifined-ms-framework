import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { TypeOrmBaseRepository } from "../../core/database/base/base.repository";
import { User } from "../../users/entities/user.entity";

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
      select: ["id", "email", "name", "password"],
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
    // TODO: Add password history tracking
    // TODO: Add audit logging for password changes
    // TODO: Consider adding password change timestamp

    await this.repository.update(userId, { password: hashedPassword });
    return this.findById(userId);
  }
}
