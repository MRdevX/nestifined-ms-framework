import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CacheService } from "@root/app/core/cache/cache.service";
import { AuthorService } from "../author/author.service";
import type { CreateBookDto, SearchBookDto, UpdateBookDto } from "./dto";
import { BookDrizzleRepository } from "./repositories/book.drizzle.repository";

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookDrizzleRepository,
    private readonly authorService: AuthorService,
    private readonly cacheService: CacheService,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<any> {
    const existingBook = await this.bookRepository.findByIsbn(createBookDto.isbn);
    if (existingBook) {
      throw new ConflictException("Book with this ISBN already exists");
    }

    const author = await this.authorService.findById(createBookDto.authorId);

    const book = await this.bookRepository.create({
      ...createBookDto,
      authorId: createBookDto.authorId,
    });

    await this.cacheBook(book);
    return book;
  }

  async findAllWithAuthor(): Promise<any[]> {
    const books = await this.bookRepository.findAll();
    const booksWithAuthor: any[] = [];

    for (const book of books) {
      const bookWithAuthor = await this.bookRepository.findByIdWithAuthor(book.id);
      if (bookWithAuthor) {
        booksWithAuthor.push(bookWithAuthor);
      }
    }

    return booksWithAuthor;
  }

  async findByIdWithAuthor(id: string): Promise<any> {
    const book = await this.bookRepository.findByIdWithAuthor(id);
    if (!book) {
      throw new NotFoundException("Book not found");
    }
    return book;
  }

  async findByIsbn(isbn: string): Promise<any | null> {
    return this.bookRepository.findByIsbn(isbn);
  }

  async searchBooks(searchParams: SearchBookDto): Promise<any[]> {
    const books = await this.bookRepository.findAll();
    const filteredBooks: any[] = [];

    for (const book of books) {
      let matches = true;

      if (searchParams.title && !book.title.toLowerCase().includes(searchParams.title.toLowerCase())) {
        matches = false;
      }

      if (searchParams.isbn && book.isbn !== searchParams.isbn) {
        matches = false;
      }

      if (searchParams.publishedDate && book.publishedDate && book.publishedDate < searchParams.publishedDate) {
        matches = false;
      }

      if (searchParams.summary && !book.summary.toLowerCase().includes(searchParams.summary.toLowerCase())) {
        matches = false;
      }

      if (matches) {
        const bookWithAuthor = await this.bookRepository.findByIdWithAuthor(book.id);
        if (bookWithAuthor) {
          filteredBooks.push(bookWithAuthor);
        }
      }
    }

    return filteredBooks;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<any> {
    if (updateBookDto.authorId) {
      await this.authorService.findById(updateBookDto.authorId);
    }

    const book = await this.bookRepository.update(id, updateBookDto);
    if (!book) {
      throw new NotFoundException("Book not found");
    }
    await this.cacheBook(book);
    return book;
  }

  async deleteBook(id: string): Promise<boolean> {
    const deleted = await this.bookRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException("Book not found");
    }
    await this.cacheService.getClient().del(`book:${id}`);
    return deleted;
  }

  public async cacheBook(book: any): Promise<void> {
    const client = this.cacheService.getClient();
    await client.set(`book:${book.id}`, JSON.stringify(book));
  }

  public async getCachedBook(id: string): Promise<any | null> {
    const client = this.cacheService.getClient();
    const data = await client.get(`book:${id}`);
    return data ? JSON.parse(data) : null;
  }

  async findAll(): Promise<any[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: string): Promise<any | null> {
    return this.bookRepository.findById(id);
  }

  async update(id: string, data: any): Promise<any | null> {
    return this.bookRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.bookRepository.delete(id);
  }
}
