import { Module } from "@nestjs/common";
import { AuthorModule } from "../author/author.module";
import { BookController } from "./book.controller";
import { BookS2SController } from "./book.s2s.controller";
import { BookS2SService } from "./book.s2s.service";
import { BookService } from "./book.service";
import { BookDrizzleRepository } from "./repositories/book.drizzle.repository";

@Module({
  imports: [AuthorModule],
  controllers: [BookController, BookS2SController],
  providers: [BookDrizzleRepository, BookService, BookS2SService],
  exports: [BookService],
})
export class BookModule {}
