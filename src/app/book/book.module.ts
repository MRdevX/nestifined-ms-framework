import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from '../author/author.module';
import { Author } from '../author/entities/author.entity';
import { AuthorRepository } from '../author/repositories/author.repository';
import { BookController } from './book.controller';
import { BookS2SController } from './book.s2s.controller';
import { BookS2SService } from './book.s2s.service';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { BookRepository } from './repositories/book.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author]), AuthorModule],
  controllers: [BookController, BookS2SController],
  providers: [BookService, BookS2SService, BookRepository, AuthorRepository],
  exports: [BookService],
})
export class BookModule {}
