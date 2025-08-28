import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CacheService } from '@root/app/core/cache/cache.service';
import type { AuthorRepository } from '../author/repositories/author.repository';
import { BaseService } from '../core/base/base.service';
import type { CreateBookDto, SearchBookDto, UpdateBookDto } from './dto';
import type { Book } from './entities/book.entity';
import type { BookRepository } from './repositories/book.repository';

@Injectable()
export class BookService extends BaseService<Book> {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly authorRepository: AuthorRepository,
    private readonly cacheService: CacheService,
  ) {
    super(bookRepository);
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findByIsbn(createBookDto.isbn);
    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    const author = await this.authorRepository.findById(createBookDto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const book = await this.bookRepository.create({
      ...createBookDto,
      author,
    });

    await this.cacheBook(book);
    return book;
  }

  async findAllWithAuthor(): Promise<Book[]> {
    return this.bookRepository.findAllWithAuthor();
  }

  async findByIdWithAuthor(id: string): Promise<Book> {
    const book = await this.bookRepository.findByIdWithAuthor(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return this.bookRepository.findByIsbn(isbn);
  }

  async searchBooks(searchParams: SearchBookDto): Promise<Book[]> {
    return this.bookRepository.searchBooks(searchParams);
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    if (updateBookDto.authorId) {
      const author = await this.authorRepository.findById(updateBookDto.authorId);
      if (!author) {
        throw new NotFoundException('Author not found');
      }
    }

    const book = await this.update(id, updateBookDto);
    await this.cacheBook(book);
    return book;
  }

  async deleteBook(id: string): Promise<void> {
    await this.delete(id);
    await this.cacheService.getClient().del(`book:${id}`);
  }

  public async cacheBook(book: Book): Promise<void> {
    const client = this.cacheService.getClient();
    await client.set(`book:${book.id}`, JSON.stringify(book));
  }

  public async getCachedBook(id: string): Promise<Book | null> {
    const client = this.cacheService.getClient();
    const data = await client.get(`book:${id}`);
    return data ? JSON.parse(data) : null;
  }
}
