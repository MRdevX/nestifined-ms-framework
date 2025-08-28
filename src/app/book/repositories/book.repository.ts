import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '../../core/base/typeorm/typeorm.base.repository';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookRepository extends TypeOrmBaseRepository<Book> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {
    super(bookRepo);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return this.bookRepo.findOne({
      where: { isbn },
    });
  }

  async findByTitle(title: string): Promise<Book[]> {
    return this.bookRepo.find({
      where: { title },
    });
  }

  async findAllWithAuthor(): Promise<Book[]> {
    return this.bookRepo.find({
      relations: ['author'],
    });
  }

  async findByIdWithAuthor(id: string): Promise<Book | null> {
    return this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async searchBooks(searchParams: {
    title?: string;
    author?: string;
    isbn?: string;
    publishedDate?: Date;
    summary?: string;
  }): Promise<Book[]> {
    const queryBuilder = this.bookRepo.createQueryBuilder('book').leftJoinAndSelect('book.author', 'author');

    if (searchParams.title) {
      queryBuilder.andWhere('book.title ILIKE :title', { title: `%${searchParams.title}%` });
    }

    if (searchParams.author) {
      queryBuilder.andWhere('author.name ILIKE :author', { author: `%${searchParams.author}%` });
    }

    if (searchParams.isbn) {
      queryBuilder.andWhere('book.isbn = :isbn', { isbn: searchParams.isbn });
    }

    if (searchParams.publishedDate) {
      queryBuilder.andWhere('book.publishedDate >= :publishedDate', { publishedDate: searchParams.publishedDate });
    }

    if (searchParams.summary) {
      queryBuilder.andWhere('book.summary ILIKE :summary', { summary: `%${searchParams.summary}%` });
    }

    return queryBuilder.getMany();
  }
}
