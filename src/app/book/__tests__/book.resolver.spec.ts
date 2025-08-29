import { Test, TestingModule } from "@nestjs/testing";
import { AuthorService } from "../../author/author.service";
import { Author } from "../../author/entities/author.graphql";
import { BookResolver } from "../book.resolver";
import { BookService } from "../book.service";
import { Book } from "../entities/book.graphql";

describe("BookResolver", () => {
  let resolver: BookResolver;
  let bookService: BookService;
  let authorService: AuthorService;

  const mockBookService = {
    findAll: jest.fn(),
    findAllWithAuthor: jest.fn(),
    findById: jest.fn(),
    findByIdWithAuthor: jest.fn(),
    createBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  const mockAuthorService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookResolver,
        {
          provide: BookService,
          useValue: mockBookService,
        },
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    resolver = module.get<BookResolver>(BookResolver);
    bookService = module.get<BookService>(BookService);
    authorService = module.get<AuthorService>(AuthorService);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("books", () => {
    it("should return an array of books", async () => {
      const result: Book[] = [
        {
          id: "1",
          title: "Test Book",
          isbn: "1234567890",
          summary: "Test summary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockBookService.findAll.mockResolvedValue(result);

      expect(await resolver.books()).toBe(result);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });
  });

  describe("book", () => {
    it("should return a single book", async () => {
      const result: Book = {
        id: "1",
        title: "Test Book",
        isbn: "1234567890",
        summary: "Test summary",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockBookService.findById.mockResolvedValue(result);

      expect(await resolver.book("1")).toBe(result);
      expect(mockBookService.findById).toHaveBeenCalledWith("1");
    });
  });
});
