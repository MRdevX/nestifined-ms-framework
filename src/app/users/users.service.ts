import { ConflictException, Injectable } from "@nestjs/common";
import { BaseService } from "../core/base/base.service";
import type { DrizzleUser } from "../core/base/drizzle/drizzle.entities";
import type { CreateUserDto } from "./dto/create-user.dto";
import { UserDrizzleRepository } from "./repositories/user.drizzle.repository";

@Injectable()
export class UsersService extends BaseService<DrizzleUser> {
  constructor(private readonly userRepository: UserDrizzleRepository) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<DrizzleUser> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }
    return this.userRepository.create(createUserDto);
  }

  async createWithPassword(email: string, hashedPassword: string, name?: string): Promise<DrizzleUser> {
    const createUserDto: CreateUserDto = {
      email,
      password: hashedPassword,
      name,
    };
    return this.createUser(createUserDto);
  }

  async findByEmail(email: string): Promise<DrizzleUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<DrizzleUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<DrizzleUser | null> {
    await this.userRepository.update(userId, { password: hashedPassword });
    return this.findById(userId);
  }
}
