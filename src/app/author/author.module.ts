import { Module } from "@nestjs/common";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { AuthorDrizzleRepository } from "./repositories/author.drizzle.repository";

@Module({
  controllers: [AuthorController],
  providers: [AuthorDrizzleRepository, AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
