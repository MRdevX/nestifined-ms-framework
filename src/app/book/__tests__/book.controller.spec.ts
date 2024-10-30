import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../book.controller';
import { BookService } from '../book.service';
import { CreateBookDto, UpdateBookDto } from '../dto';

describe('BookController', () => {
  let controller: BookController;

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
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
      const book = { id: uuidv4(), ...createBookDto };

      mockBookService.create.mockResolvedValue(book);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(book);
      expect(mockBookService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [{ id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } }];
      mockBookService.findAll.mockResolvedValue(books);

      const result = await controller.findAll();
      expect(result).toEqual(books);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const book = { id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } };
      mockBookService.findOne.mockResolvedValue(book);

      const result = await controller.findOne(book.id);
      expect(result).toEqual(book);
      expect(mockBookService.findOne).toHaveBeenCalledWith(book.id);
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
      const book = { id: uuidv4(), ...updateBookDto };

      mockBookService.update.mockResolvedValue(book);

      const result = await controller.update(book.id, updateBookDto);
      expect(result).toEqual(book);
      expect(mockBookService.update).toHaveBeenCalledWith(book.id, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const book = { id: uuidv4(), title: 'Book Title', author: { id: uuidv4(), name: 'Author Name' } };

      mockBookService.remove.mockResolvedValue(undefined);

      await controller.remove(book.id);
      expect(mockBookService.remove).toHaveBeenCalledWith(book.id);
    });
  });
});
