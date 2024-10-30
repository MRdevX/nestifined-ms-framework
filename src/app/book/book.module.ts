import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookS2SService } from './book.s2s.service';
import { BookS2SController } from './book.s2s.controller';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author]), AuthorModule],
  controllers: [BookController, BookS2SController],
  providers: [BookService, BookS2SService],
})
export class BookModule {}
