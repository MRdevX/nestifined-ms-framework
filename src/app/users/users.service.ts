import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../core/base/base.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { User } from './entities/user.entity';
import type { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.userRepository.create(createUserDto);
  }

  async createWithPassword(email: string, hashedPassword: string, name?: string): Promise<User> {
    const createUserDto: CreateUserDto = {
      email,
      password: hashedPassword,
      name,
    };
    return this.createUser(createUserDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmailWithPassword(email);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
    await this.userRepository.updatePassword(userId, hashedPassword);
    return this.findById(userId);
  }
}
