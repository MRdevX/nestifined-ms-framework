import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '../../core/base/typeorm/typeorm.base.repository';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserRepository extends TypeOrmBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
    await this.userRepository.update(userId, { password: hashedPassword });
    return this.findById(userId);
  }
}
