import { Repository, Like } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto, UpdateBookDto, SearchBookDto } from './dto';
import { Book } from './entities/book.entity';
import { CacheService } from '../core/cache/cache.service';
import { Author } from '../author/entities/author.entity';

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
    const author = await this.authorRepository.findOne({ where: { id: createBookDto.authorId } });
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
    return this.bookRepository.find({ relations: ['author'] });
  }

  async findOne(id: string): Promise<Book> {
    const cachedBook = await this.getCachedBook(id);
    if (cachedBook) {
      return cachedBook;
    }

    const book = await this.bookRepository.findOne({ where: { id }, relations: ['author'] });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.cacheBook(book);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: updateBookDto.authorId } });
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
    await this.cacheBook(book);
    return book;
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    await this.cacheService.getClient().del(`book:${id}`);
  }

  async findByQuery(query: SearchBookDto): Promise<Book[]> {
    const where = {};
    if (query.title) {
      where['title'] = Like(`%${query.title}%`);
    }
    if (query.author) {
      where['author'] = Like(`%${query.author}%`);
    }
    return this.bookRepository.find({ where, relations: ['author'] });
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
