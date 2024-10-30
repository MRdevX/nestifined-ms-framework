import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { mock, MockProxy } from 'jest-mock-extended';
import Redis from 'ioredis-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '@root/app/core/cache/cache.service';
import { Author } from '@root/app/author/entities/author.entity';
import { Book } from '@root/app/book/entities/book.entity';
import { ERRORS } from '@root/app/core/errors/errors';
import { createMockAuthor } from '@test/mocks/author.mock';
import { BookService } from '../book.service';

const createBookDtoFactory = () => ({
  title: 'Book Title',
  authorId: uuidv4(),
  isbn: '1234567890',
  summary: 'Book Summary',
  publishedDate: new Date(),
});

describe('BookService', () => {
  let service: BookService;
  let bookRepository: MockProxy<Repository<Book>>;
  let authorRepository: MockProxy<Repository<Author>>;
  let cacheService: MockProxy<CacheService>;
  let redisClient: MockProxy<typeof Redis.prototype>;

  beforeEach(async () => {
    redisClient = new Redis() as unknown as MockProxy<typeof Redis.prototype>;
    redisClient.del = jest.fn();

    cacheService = mock<CacheService>();
    cacheService.getClient.mockReturnValue(redisClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getRepositoryToken(Book), useValue: mock<Repository<Book>>() },
        { provide: getRepositoryToken(Author), useValue: mock<Repository<Author>>() },
        { provide: CacheService, useValue: cacheService },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get(getRepositoryToken(Book));
    authorRepository = module.get(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = createBookDtoFactory();
      const author = createMockAuthor();
      author.id = createBookDto.authorId;
      const book: Partial<Book> = { id: uuidv4(), ...createBookDto, author };

      authorRepository.findOne.mockResolvedValue(author as Author);
      bookRepository.create.mockReturnValue(book as Book);
      bookRepository.save.mockResolvedValue(book as Book);

      const result = await service.create(createBookDto);
      expect(result).toEqual(book);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: createBookDto.authorId, deletedAt: null } });
      expect(bookRepository.create).toHaveBeenCalledWith({ ...createBookDto, author });
      expect(bookRepository.save).toHaveBeenCalledWith(book);
    });

    it('should throw an error if author not found', async () => {
      const createBookDto = createBookDtoFactory();
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookDto)).rejects.toThrow(ERRORS.AUTHOR.NOT_FOUND.message);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: createBookDto.authorId, deletedAt: null } });
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const author = createMockAuthor();
      const books: Partial<Book>[] = [{ id: uuidv4(), title: 'Book Title', author }];
      bookRepository.find.mockResolvedValue(books as Book[]);

      const result = await service.findAll();
      expect(result).toEqual(books);
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { deletedAt: null }, relations: ['author'] });
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const author = createMockAuthor();
      const book: Partial<Book> = { id: uuidv4(), title: 'Book Title', author };
      bookRepository.findOne.mockResolvedValue(book as Book);

      const result = await service.findOne(book.id as string);
      expect(result).toEqual(book);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: book.id, deletedAt: null },
        relations: ['author'],
      });
    });

    it('should throw an error if book not found', async () => {
      const bookId = uuidv4();
      bookRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(bookId)).rejects.toThrow(ERRORS.BOOK.NOT_FOUND.message);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId, deletedAt: null },
        relations: ['author'],
      });
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = createBookDtoFactory();
      const author = createMockAuthor();
      author.id = updateBookDto.authorId;
      const book: Partial<Book> = { id: uuidv4(), ...updateBookDto, author };

      authorRepository.findOne.mockResolvedValue(author as Author);
      bookRepository.preload.mockResolvedValue(book as Book);
      bookRepository.save.mockResolvedValue(book as Book);

      const result = await service.update(book.id as string, updateBookDto);
      expect(result).toEqual(book);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: updateBookDto.authorId, deletedAt: null } });
      expect(bookRepository.preload).toHaveBeenCalledWith({ id: book.id, ...updateBookDto, author });
      expect(bookRepository.save).toHaveBeenCalledWith(book);
    });

    it('should throw an error if author not found', async () => {
      const updateBookDto = createBookDtoFactory();
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.update(uuidv4(), updateBookDto)).rejects.toThrow(ERRORS.NOT_FOUND('Author').message);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: updateBookDto.authorId, deletedAt: null } });
    });

    it('should throw an error if book not found', async () => {
      const bookId = uuidv4();
      const updateBookDto = createBookDtoFactory();
      const author = createMockAuthor();
      author.id = updateBookDto.authorId;

      authorRepository.findOne.mockResolvedValue(author as Author);
      bookRepository.preload.mockResolvedValue(null);

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(ERRORS.BOOK.NOT_FOUND.message);
      expect(bookRepository.preload).toHaveBeenCalledWith({ id: bookId, ...updateBookDto, author });
    });
  });

  describe('remove', () => {
    it('should mark a book as deleted', async () => {
      const author = createMockAuthor();
      const book: Partial<Book> = { id: uuidv4(), title: 'Book Title', author };
      bookRepository.findOne.mockResolvedValue(book as Book);
      bookRepository.save.mockResolvedValue({ ...book, deletedAt: new Date() } as Book);

      await service.remove(book.id as string);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: book.id, deletedAt: null },
        relations: ['author'],
      });
      expect(bookRepository.save).toHaveBeenCalledWith(expect.objectContaining({ deletedAt: expect.any(Date) }));
      expect(redisClient.del).toHaveBeenCalledWith(`book:${book.id}`);
    });
  });
});
