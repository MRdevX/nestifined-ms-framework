import { ConflictException, Injectable } from "@nestjs/common";
import { BaseService } from "../core/base/base.service";
import type { DrizzleAuthor, DrizzleAuthorWithBooks } from "../core/base/drizzle/drizzle.entities";
import type { CreateAuthorDto } from "./dto";
import { AuthorDrizzleRepository } from "./repositories/author.drizzle.repository";

@Injectable()
export class AuthorService extends BaseService<DrizzleAuthor> {
  constructor(private readonly authorRepository: AuthorDrizzleRepository) {
    super(authorRepository);
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<DrizzleAuthor> {
    const existingAuthor = await this.authorRepository.findByName(createAuthorDto.name);
    if (existingAuthor) {
      throw new ConflictException("Author with this name already exists");
    }
    return this.authorRepository.create(createAuthorDto);
  }

  async findAllWithBooks(): Promise<DrizzleAuthorWithBooks[]> {
    const authors = await this.authorRepository.findAll();
    const authorsWithBooks: DrizzleAuthorWithBooks[] = [];

    for (const author of authors) {
      const authorWithBooks = await this.authorRepository.findByIdWithBooks(author.id);
      if (authorWithBooks) {
        authorsWithBooks.push(authorWithBooks);
      }
    }

    return authorsWithBooks;
  }

  async findByIdWithBooks(id: string): Promise<DrizzleAuthorWithBooks> {
    const author = await this.authorRepository.findByIdWithBooks(id);
    if (!author) {
      throw new Error("Author not found");
    }
    return author;
  }

  async findByName(name: string): Promise<DrizzleAuthor | null> {
    return this.authorRepository.findByName(name);
  }
}
