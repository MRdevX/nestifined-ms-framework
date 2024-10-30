import { v4 as uuidv4 } from 'uuid';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthor } from '@test/mocks/author.mock';
import { BookController } from '../book.controller';
import { BookService } from '../book.service';
import { CreateBookDto, UpdateBookDto } from '../dto';
import { Book } from '../entities/book.entity';

describe('BookController', () => {
  let controller: BookController;
  let bookService: MockProxy<BookService>;

  beforeEach(async () => {
    bookService = mock<BookService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: bookService }],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Book Summary',
        publishedDate: new Date(),
      };
      const author = createMockAuthor();
      const book: Partial<Book> = { id: uuidv4(), ...createBookDto, author };

      bookService.create.mockResolvedValue(book as Book);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(book);
      expect(bookService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const author = createMockAuthor();
      const books: Partial<Book>[] = [{ id: uuidv4(), title: 'Book Title', author }];
      bookService.findAll.mockResolvedValue(books as Book[]);

      const result = await controller.findAll();
      expect(result).toEqual(books);
      expect(bookService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const author = createMockAuthor();
      const book: Partial<Book> = { id: uuidv4(), title: 'Book Title', author };
      bookService.findOne.mockResolvedValue(book as Book);

      const result = await controller.findOne(book.id as string);
      expect(result).toEqual(book);
      expect(bookService.findOne).toHaveBeenCalledWith(book.id);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book Title',
        authorId: uuidv4(),
        isbn: '1234567890',
        summary: 'Updated Book Summary',
        publishedDate: new Date(),
      };
      const author = createMockAuthor();
      author.id = updateBookDto.authorId;
      const book: Partial<Book> = { id: uuidv4(), ...updateBookDto, author };

      bookService.update.mockResolvedValue(book as Book);

      const result = await controller.update(book.id as string, updateBookDto);
      expect(result).toEqual(book);
      expect(bookService.update).toHaveBeenCalledWith(book.id, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const author = createMockAuthor();
      const book: Partial<Book> = { id: uuidv4(), title: 'Book Title', author };

      bookService.remove.mockResolvedValue(undefined);

      await controller.remove(book.id as string);
      expect(bookService.remove).toHaveBeenCalledWith(book.id);
    });
  });
});
