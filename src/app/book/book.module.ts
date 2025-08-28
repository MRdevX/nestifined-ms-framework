import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorModule } from "../author/author.module";
import { BookController } from "./book.controller";
import { BookS2SController } from "./book.s2s.controller";
import { BookS2SService } from "./book.s2s.service";
import { BookService } from "./book.service";
import { Book } from "./entities/book.entity";
import { BookRepository } from "./repositories/book.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule],
  controllers: [BookController, BookS2SController],
  providers: [BookRepository, BookService, BookS2SService],
  exports: [BookService],
})
export class BookModule {}
