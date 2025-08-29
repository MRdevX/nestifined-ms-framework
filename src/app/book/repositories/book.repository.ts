import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { TypeOrmBaseRepository } from "../../core/database/base/base.repository";
import { Book } from "../entities/book.entity";

@Injectable()
export class BookRepository extends TypeOrmBaseRepository<Book> {
  constructor(
    @InjectRepository(Book)
    repository: Repository<Book>,
  ) {
    super(repository);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const results = (await this.search({
      filters: { isbn },
      withPagination: false,
    })) as Book[];

    return results.length > 0 ? results[0] : null;
  }

  async findByTitle(title: string): Promise<Book[]> {
    return this.search({
      filters: { title },
      withPagination: false,
    }) as Promise<Book[]>;
  }

  async findAllWithAuthor(): Promise<Book[]> {
    return this.search({
      relations: ["author"],
      withPagination: false,
    }) as Promise<Book[]>;
  }

  async findByIdWithAuthor(id: string): Promise<Book | null> {
    const results = (await this.search({
      filters: { id },
      relations: ["author"],
      withPagination: false,
    })) as Book[];

    return results.length > 0 ? results[0] : null;
  }

  async searchBooks(searchParams: {
    title?: string;
    author?: string;
    isbn?: string;
    publishedDate?: Date;
    summary?: string;
  }): Promise<Book[]> {
    const filters: Record<string, string | Date> = {};

    if (searchParams.title) filters.title = searchParams.title;
    if (searchParams.isbn) filters.isbn = searchParams.isbn;
    if (searchParams.publishedDate) filters.publishedDate = searchParams.publishedDate;
    if (searchParams.summary) filters.summary = searchParams.summary;

    return this.search({
      filters,
      relations: ["author"],
      withPagination: false,
    }) as Promise<Book[]>;
  }

  protected getSearchableFields(): string[] {
    return ["title", "isbn", "summary"];
  }
}
