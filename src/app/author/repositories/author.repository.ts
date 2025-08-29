import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { TypeOrmBaseRepository } from "../../core/database/base/base.repository";
import { Author } from "../entities/author.entity";

@Injectable()
export class AuthorRepository extends TypeOrmBaseRepository<Author> {
  constructor(
    @InjectRepository(Author)
    repository: Repository<Author>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Author | null> {
    return this.repository.findOne({
      where: { name },
    });
  }

  async findAllWithBooks(): Promise<Author[]> {
    return this.search({
      relations: ["books"],
      withPagination: false,
    }) as Promise<Author[]>;
  }

  async findByIdWithBooks(id: string): Promise<Author | null> {
    const results = (await this.search({
      filters: { id },
      relations: ["books"],
      withPagination: false,
    })) as Author[];

    return results.length > 0 ? results[0] : null;
  }

  async findAuthorsWithBooksPaginated(page: number = 1, limit: number = 10, search?: string) {
    const filters = search ? { search } : {};
    return this.search({
      pagination: { page, limit, sortBy: "name", sortOrder: "ASC" },
      filters,
      relations: ["books"],
      withPagination: true,
    });
  }

  protected getSearchableFields(): string[] {
    return ["name"];
  }
}
