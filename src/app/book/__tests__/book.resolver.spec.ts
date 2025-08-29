import { Test, TestingModule } from "@nestjs/testing";
import { AuthorService } from "../../author/author.service";
import { Author } from "../../author/entities/author.graphql";
import { BookResolver } from "../book.resolver";
import { BookService } from "../book.service";
import { CreateBookInput } from "../dto/create-book.input";
import { SearchBookInput } from "../dto/search-book.input";
import { UpdateBookInput } from "../dto/update-book.input";
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
    searchBooks: jest.fn(),
  };

  const mockAuthorService = {
    findById: jest.fn(),
  };

  const mockBook: Book = {
    id: "1",
    title: "Test Book",
    isbn: "1234567890",
    summary: "Test summary",
    authorId: "author-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthor: Author = {
    id: "author-1",
    name: "Test Author",
    createdAt: new Date(),
    updatedAt: new Date(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("books", () => {
    it("should return an array of books", async () => {
      const result: Book[] = [mockBook];
      mockBookService.findAll.mockResolvedValue(result);

      const books = await resolver.books();
      expect(books).toBe(result);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });

    it("should handle empty array", async () => {
      mockBookService.findAll.mockResolvedValue([]);

      const books = await resolver.books();
      expect(books).toEqual([]);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });
  });

  describe("booksWithAuthor", () => {
    it("should return an array of books with author data", async () => {
      const result: Book[] = [mockBook];
      mockBookService.findAllWithAuthor.mockResolvedValue(result);

      const books = await resolver.booksWithAuthor();
      expect(books).toBe(result);
      expect(mockBookService.findAllWithAuthor).toHaveBeenCalled();
    });
  });

  describe("searchBooks", () => {
    it("should return filtered books based on search input", async () => {
      const searchInput: SearchBookInput = { title: "Test" };
      const result: Book[] = [mockBook];
      mockBookService.searchBooks.mockResolvedValue(result);

      const books = await resolver.searchBooks(searchInput);
      expect(books).toBe(result);
      expect(mockBookService.searchBooks).toHaveBeenCalledWith(searchInput);
    });

    it("should handle empty search results", async () => {
      const searchInput: SearchBookInput = { title: "NonExistent" };
      mockBookService.searchBooks.mockResolvedValue([]);

      const books = await resolver.searchBooks(searchInput);
      expect(books).toEqual([]);
      expect(mockBookService.searchBooks).toHaveBeenCalledWith(searchInput);
    });
  });

  describe("book", () => {
    it("should return a single book by id", async () => {
      mockBookService.findById.mockResolvedValue(mockBook);

      const book = await resolver.book("1");
      expect(book).toBe(mockBook);
      expect(mockBookService.findById).toHaveBeenCalledWith("1");
    });

    it("should return null when book not found", async () => {
      mockBookService.findById.mockResolvedValue(null);

      const book = await resolver.book("999");
      expect(book).toBeNull();
      expect(mockBookService.findById).toHaveBeenCalledWith("999");
    });
  });

  describe("bookWithAuthor", () => {
    it("should return a book with author data", async () => {
      mockBookService.findByIdWithAuthor.mockResolvedValue(mockBook);

      const book = await resolver.bookWithAuthor("1");
      expect(book).toBe(mockBook);
      expect(mockBookService.findByIdWithAuthor).toHaveBeenCalledWith("1");
    });

    it("should return null when book not found", async () => {
      mockBookService.findByIdWithAuthor.mockResolvedValue(null);

      const book = await resolver.bookWithAuthor("999");
      expect(book).toBeNull();
      expect(mockBookService.findByIdWithAuthor).toHaveBeenCalledWith("999");
    });
  });

  describe("createBook", () => {
    it("should create a new book", async () => {
      const createBookInput: CreateBookInput = {
        title: "New Book",
        authorId: "author-1",
        isbn: "9876543210",
        summary: "New book summary",
      };
      const createdBook = { ...mockBook, ...createBookInput };
      mockBookService.createBook.mockResolvedValue(createdBook);

      const result = await resolver.createBook(createBookInput);
      expect(result).toBe(createdBook);
      expect(mockBookService.createBook).toHaveBeenCalledWith(createBookInput);
    });
  });

  describe("updateBook", () => {
    it("should update an existing book", async () => {
      const updateBookInput: UpdateBookInput = {
        title: "Updated Book Title",
      };
      const updatedBook = { ...mockBook, ...updateBookInput };
      mockBookService.updateBook.mockResolvedValue(updatedBook);

      const result = await resolver.updateBook("1", updateBookInput);
      expect(result).toBe(updatedBook);
      expect(mockBookService.updateBook).toHaveBeenCalledWith("1", updateBookInput);
    });
  });

  describe("deleteBook", () => {
    it("should delete a book and return true", async () => {
      mockBookService.deleteBook.mockResolvedValue(undefined);

      const result = await resolver.deleteBook("1");
      expect(result).toBe(true);
      expect(mockBookService.deleteBook).toHaveBeenCalledWith("1");
    });
  });

  describe("author", () => {
    it("should return author when authorId exists", async () => {
      mockAuthorService.findById.mockResolvedValue(mockAuthor);

      const author = await resolver.author(mockBook);
      expect(author).toBe(mockAuthor);
      expect(mockAuthorService.findById).toHaveBeenCalledWith("author-1");
    });

    it("should return null when authorId is null", async () => {
      const bookWithoutAuthor = { ...mockBook, authorId: null };

      const author = await resolver.author(bookWithoutAuthor);
      expect(author).toBeNull();
      expect(mockAuthorService.findById).not.toHaveBeenCalled();
    });

    it("should return null when authorId is undefined", async () => {
      const bookWithoutAuthor = { ...mockBook, authorId: undefined };

      const author = await resolver.author(bookWithoutAuthor);
      expect(author).toBeNull();
      expect(mockAuthorService.findById).not.toHaveBeenCalled();
    });

    it("should return null when authorId is empty string", async () => {
      const bookWithoutAuthor = { ...mockBook, authorId: "" };

      const author = await resolver.author(bookWithoutAuthor);
      expect(author).toBeNull();
      expect(mockAuthorService.findById).not.toHaveBeenCalled();
    });

    it("should return null when author not found", async () => {
      mockAuthorService.findById.mockResolvedValue(null);

      const author = await resolver.author(mockBook);
      expect(author).toBeNull();
      expect(mockAuthorService.findById).toHaveBeenCalledWith("author-1");
    });
  });
});
