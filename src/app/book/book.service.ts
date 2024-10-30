import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto, UpdateBookDto, SearchBookDto } from './dto';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { CacheService } from '../core/cache/cache.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: createBookDto.authorId, deletedAt: null } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
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
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: updateBookDto.authorId, deletedAt: null } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${updateBookDto.authorId} not found`);
    }

    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
      author,
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
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
    const qb = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .where('book.deletedAt IS NULL');

    if (query.title) {
      qb.andWhere('book.title LIKE :title', { title: `%${query.title}%` });
    }
    if (query.author) {
      qb.andWhere('author.name LIKE :author', { author: `%${query.author}%` });
    }
    if (query.isbn) {
      qb.andWhere('book.isbn = :isbn', { isbn: query.isbn });
    }
    if (query.publishedDate) {
      qb.andWhere('book.publishedDate >= :publishedDate', { publishedDate: query.publishedDate });
    }
    if (query.summary) {
      qb.andWhere('book.summary LIKE :summary', { summary: `%${query.summary}%` });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
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
