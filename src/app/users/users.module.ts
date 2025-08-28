import { Module } from "@nestjs/common";
import { UserDrizzleRepository } from "./repositories/user.drizzle.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserDrizzleRepository],
  exports: [UsersService],
})
export class UsersModule {}
