import { ConflictException, Injectable } from "@nestjs/common";
import { BaseService } from "../core/database/base/base.service";
import type { CreateAuthorDto } from "./dto";
import type { Author } from "./entities/author.entity";
import { AuthorRepository } from "./repositories/author.repository";

@Injectable()
export class AuthorService extends BaseService<Author> {
  constructor(private readonly authorRepository: AuthorRepository) {
    super(authorRepository);
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorRepository.findByName(createAuthorDto.name);
    if (existingAuthor) {
      throw new ConflictException("Author with this name already exists");
    }
    return this.authorRepository.create(createAuthorDto);
  }

  async findAllWithBooks(): Promise<Author[]> {
    return this.authorRepository.findAllWithBooks();
  }

  async findByIdWithBooks(id: string): Promise<Author> {
    const author = await this.authorRepository.findByIdWithBooks(id);
    if (!author) {
      throw new Error("Author not found");
    }
    return author;
  }

  async findByName(name: string): Promise<Author | null> {
    return this.authorRepository.findByName(name);
  }
}
