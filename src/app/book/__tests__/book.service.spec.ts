import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '@root/app/core/cache/cache.service';
import { Author } from '@root/app/author/entities/author.entity';
import { Book } from '@root/app/book/entities/book.entity';
import { BookService } from '../book.service';

const mockBookRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

const mockAuthorRepository = () => ({
  findOne: jest.fn(),
});

const mockCacheService = () => ({
  getClient: jest.fn().mockReturnValue({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  }),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('BookService', () => {
  let service: BookService;
  let bookRepository: MockRepository;
  let authorRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getRepositoryToken(Book), useValue: mockBookRepository() },
        { provide: getRepositoryToken(Author), useValue: mockAuthorRepository() },
        { provide: CacheService, useValue: mockCacheService() },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<MockRepository>(getRepositoryToken(Book));
    authorRepository = module.get<MockRepository>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Book Summary',
        publishedDate: new Date(),
      };
      const author = { id: createBookDto.authorId, name: 'Author Name' };
      const book = { id: uuidv4(), ...createBookDto, author };

      authorRepository.findOne.mockResolvedValue(author);
      bookRepository.create.mockReturnValue(book);
      bookRepository.save.mockResolvedValue(book);

      const result = await service.create(createBookDto);
      expect(result).toEqual(book);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: createBookDto.authorId, deletedAt: null } });
      expect(bookRepository.create).toHaveBeenCalledWith({ ...createBookDto, author });
      expect(bookRepository.save).toHaveBeenCalledWith(book);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [{ id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } }];
      bookRepository.find.mockResolvedValue(books);

      const result = await service.findAll();
      expect(result).toEqual(books);
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { deletedAt: null }, relations: ['author'] });
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const book = { id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } };
      bookRepository.findOne.mockResolvedValue(book);

      const result = await service.findOne(book.id);
      expect(result).toEqual(book);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: book.id, deletedAt: null },
        relations: ['author'],
      });
    });

    it('should throw an error if book not found', async () => {
      const bookId = uuidv4();
      bookRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(bookId)).rejects.toThrow(`Book with ID ${bookId} not found`);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Updated Book Summary',
        publishedDate: new Date(),
      };
      const author = { id: updateBookDto.authorId, name: 'Author Name' };
      const book = { id: uuidv4(), ...updateBookDto, author };

      authorRepository.findOne.mockResolvedValue(author);
      bookRepository.preload.mockResolvedValue(book);
      bookRepository.save.mockResolvedValue(book);

      const result = await service.update(book.id, updateBookDto);
      expect(result).toEqual(book);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: updateBookDto.authorId, deletedAt: null } });
      expect(bookRepository.preload).toHaveBeenCalledWith({ id: book.id, ...updateBookDto, author });
      expect(bookRepository.save).toHaveBeenCalledWith(book);
    });

    it('should throw an error if author not found', async () => {
      const updateBookDto = {
        title: 'Updated Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Updated Book Summary',
        publishedDate: new Date(),
      };
      const authorId = updateBookDto.authorId;
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.update(uuidv4(), updateBookDto)).rejects.toThrow(`Author with ID ${authorId} not found`);
    });

    it('should throw an error if book not found', async () => {
      const bookId = uuidv4();
      const updateBookDto = {
        title: 'Updated Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Updated Book Summary',
        publishedDate: new Date(),
      };
      const author = { id: updateBookDto.authorId, name: 'Author Name' };

      authorRepository.findOne.mockResolvedValue(author);
      bookRepository.preload.mockResolvedValue(null);

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(`Book with ID ${bookId} not found`);
    });
  });

  describe('remove', () => {
    it('should mark a book as deleted', async () => {
      const book = { id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } };
      bookRepository.findOne.mockResolvedValue(book);
      bookRepository.save.mockResolvedValue({ ...book, deletedAt: new Date() });

      await service.remove(book.id);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: book.id, deletedAt: null },
        relations: ['author'],
      });
      expect(bookRepository.save).toHaveBeenCalledWith(expect.objectContaining({ deletedAt: expect.any(Date) }));
    });
  });
});
