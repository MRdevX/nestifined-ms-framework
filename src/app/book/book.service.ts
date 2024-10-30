import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryNarrowingOperators } from '@root/app/core/base/base-search.model';
import { CacheService } from '@root/app/core/cache/cache.service';
import { BaseSearchService } from '@root/app/core/base/base-search.service';
import { CreateBookDto, UpdateBookDto, SearchBookDto } from './dto';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { ERRORS } from '../core/errors/errors';

@Injectable()
export class BookService extends BaseSearchService<Book> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly cacheService: CacheService,
  ) {
    super(bookRepository);
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: createBookDto.authorId, deletedAt: null } });
    if (!author) {
      throw new NotFoundException(ERRORS.AUTHOR.NOT_FOUND);
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      author,
    });
    await this.bookRepository.save(book);
    await this.cacheBook(book);
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ where: { deletedAt: null }, relations: ['author'] });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id, deletedAt: null }, relations: ['author'] });
    if (!book) {
      throw new NotFoundException(ERRORS.BOOK.NOT_FOUND);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: updateBookDto.authorId, deletedAt: null } });
    if (!author) {
      throw new NotFoundException(ERRORS.NOT_FOUND('Author'));
    }

    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
      author,
    });
    if (!book) {
      throw new NotFoundException(ERRORS.BOOK.NOT_FOUND);
    }
    await this.bookRepository.save(book);
    return book;
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    book.deletedAt = new Date();
    await this.bookRepository.save(book);
    await this.cacheService.getClient().del(`book:${id}`);
  }

  async search(query: SearchBookDto): Promise<{ items: Book[]; total: number }> {
    return super.search({
      ...query,
      relations: ['author'],
      filterFields: [
        { name: 'title', value: query.title, operation: QueryNarrowingOperators.LIKE },
        { name: 'author', value: query.author, operation: QueryNarrowingOperators.EQ }, // Changed to EQ
        { name: 'isbn', value: query.isbn, operation: QueryNarrowingOperators.EQ },
        { name: 'publishedDate', value: query.publishedDate, operation: QueryNarrowingOperators.GTE },
        { name: 'summary', value: query.summary, operation: QueryNarrowingOperators.LIKE },
      ],
    });
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
