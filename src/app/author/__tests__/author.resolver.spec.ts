import { Test, TestingModule } from "@nestjs/testing";
import { AuthorResolver } from "../author.resolver";
import { AuthorService } from "../author.service";
import { CreateAuthorInput } from "../dto/create-author.input";
import { UpdateAuthorInput } from "../dto/update-author.input";
import { Author } from "../entities/author.graphql";

describe("AuthorResolver", () => {
  let resolver: AuthorResolver;
  let authorService: AuthorService;

  const mockAuthorService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createAuthor: jest.fn(),
    updateAuthor: jest.fn(),
    deleteAuthor: jest.fn(),
  };

  const mockAuthor: Author = {
    id: "1",
    name: "Test Author",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorResolver,
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    resolver = module.get<AuthorResolver>(AuthorResolver);
    authorService = module.get<AuthorService>(AuthorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("authors", () => {
    it("should return an array of authors", async () => {
      const result: Author[] = [mockAuthor];
      mockAuthorService.findAll.mockResolvedValue(result);

      const authors = await resolver.authors();
      expect(authors).toBe(result);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });

    it("should handle empty array", async () => {
      mockAuthorService.findAll.mockResolvedValue([]);

      const authors = await resolver.authors();
      expect(authors).toEqual([]);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });

    it("should handle multiple authors", async () => {
      const multipleAuthors: Author[] = [
        mockAuthor,
        {
          id: "2",
          name: "Second Author",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockAuthorService.findAll.mockResolvedValue(multipleAuthors);

      const authors = await resolver.authors();
      expect(authors).toBe(multipleAuthors);
      expect(authors).toHaveLength(2);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });
  });

  describe("author", () => {
    it("should return a single author by id", async () => {
      mockAuthorService.findById.mockResolvedValue(mockAuthor);

      const author = await resolver.author("1");
      expect(author).toBe(mockAuthor);
      expect(mockAuthorService.findById).toHaveBeenCalledWith("1");
    });

    it("should return null when author not found", async () => {
      mockAuthorService.findById.mockResolvedValue(null);

      const author = await resolver.author("999");
      expect(author).toBeNull();
      expect(mockAuthorService.findById).toHaveBeenCalledWith("999");
    });

    it("should handle empty string id", async () => {
      mockAuthorService.findById.mockResolvedValue(null);

      const author = await resolver.author("");
      expect(author).toBeNull();
      expect(mockAuthorService.findById).toHaveBeenCalledWith("");
    });
  });

  describe("createAuthor", () => {
    it("should create a new author", async () => {
      const createAuthorInput: CreateAuthorInput = {
        name: "New Author",
      };
      const createdAuthor = { ...mockAuthor, ...createAuthorInput };
      mockAuthorService.createAuthor.mockResolvedValue(createdAuthor);

      const result = await resolver.createAuthor(createAuthorInput);
      expect(result).toBe(createdAuthor);
      expect(mockAuthorService.createAuthor).toHaveBeenCalledWith(createAuthorInput);
    });

    it("should create author with different name", async () => {
      const createAuthorInput: CreateAuthorInput = {
        name: "Another Author",
      };
      const createdAuthor = { ...mockAuthor, name: "Another Author" };
      mockAuthorService.createAuthor.mockResolvedValue(createdAuthor);

      const result = await resolver.createAuthor(createAuthorInput);
      expect(result).toBe(createdAuthor);
      expect(result.name).toBe("Another Author");
      expect(mockAuthorService.createAuthor).toHaveBeenCalledWith(createAuthorInput);
    });
  });

  describe("updateAuthor", () => {
    it("should update an existing author", async () => {
      const updateAuthorInput: UpdateAuthorInput = {
        name: "Updated Author Name",
      };
      const updatedAuthor = { ...mockAuthor, ...updateAuthorInput };
      mockAuthorService.updateAuthor.mockResolvedValue(updatedAuthor);

      const result = await resolver.updateAuthor("1", updateAuthorInput);
      expect(result).toBe(updatedAuthor);
      expect(mockAuthorService.updateAuthor).toHaveBeenCalledWith("1", updateAuthorInput);
    });

    it("should update author with partial data", async () => {
      const updateAuthorInput: UpdateAuthorInput = {
        name: "Partially Updated Author",
      };
      const updatedAuthor = { ...mockAuthor, name: "Partially Updated Author" };
      mockAuthorService.updateAuthor.mockResolvedValue(updatedAuthor);

      const result = await resolver.updateAuthor("1", updateAuthorInput);
      expect(result).toBe(updatedAuthor);
      expect(result.name).toBe("Partially Updated Author");
      expect(mockAuthorService.updateAuthor).toHaveBeenCalledWith("1", updateAuthorInput);
    });

    it("should handle update with empty input", async () => {
      const updateAuthorInput: UpdateAuthorInput = {};
      const updatedAuthor = { ...mockAuthor };
      mockAuthorService.updateAuthor.mockResolvedValue(updatedAuthor);

      const result = await resolver.updateAuthor("1", updateAuthorInput);
      expect(result).toBe(updatedAuthor);
      expect(mockAuthorService.updateAuthor).toHaveBeenCalledWith("1", updateAuthorInput);
    });
  });

  describe("deleteAuthor", () => {
    it("should delete an author and return true", async () => {
      mockAuthorService.deleteAuthor.mockResolvedValue(undefined);

      const result = await resolver.deleteAuthor("1");
      expect(result).toBe(true);
      expect(mockAuthorService.deleteAuthor).toHaveBeenCalledWith("1");
    });

    it("should handle deletion of non-existent author", async () => {
      mockAuthorService.deleteAuthor.mockResolvedValue(undefined);

      const result = await resolver.deleteAuthor("999");
      expect(result).toBe(true);
      expect(mockAuthorService.deleteAuthor).toHaveBeenCalledWith("999");
    });
  });

  describe("error handling", () => {
    it("should handle service errors in findAll", async () => {
      const error = new Error("Database connection failed");
      mockAuthorService.findAll.mockRejectedValue(error);

      await expect(resolver.authors()).rejects.toThrow("Database connection failed");
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });

    it("should handle service errors in findById", async () => {
      const error = new Error("Author not found");
      mockAuthorService.findById.mockRejectedValue(error);

      await expect(resolver.author("1")).rejects.toThrow("Author not found");
      expect(mockAuthorService.findById).toHaveBeenCalledWith("1");
    });

    it("should handle service errors in createAuthor", async () => {
      const createAuthorInput: CreateAuthorInput = { name: "Test Author" };
      const error = new Error("Author with this name already exists");
      mockAuthorService.createAuthor.mockRejectedValue(error);

      await expect(resolver.createAuthor(createAuthorInput)).rejects.toThrow("Author with this name already exists");
      expect(mockAuthorService.createAuthor).toHaveBeenCalledWith(createAuthorInput);
    });

    it("should handle service errors in updateAuthor", async () => {
      const updateAuthorInput: UpdateAuthorInput = { name: "Updated Name" };
      const error = new Error("Author not found");
      mockAuthorService.updateAuthor.mockRejectedValue(error);

      await expect(resolver.updateAuthor("999", updateAuthorInput)).rejects.toThrow("Author not found");
      expect(mockAuthorService.updateAuthor).toHaveBeenCalledWith("999", updateAuthorInput);
    });

    it("should handle service errors in deleteAuthor", async () => {
      const error = new Error("Author not found");
      mockAuthorService.deleteAuthor.mockRejectedValue(error);

      await expect(resolver.deleteAuthor("999")).rejects.toThrow("Author not found");
      expect(mockAuthorService.deleteAuthor).toHaveBeenCalledWith("999");
    });
  });
});
