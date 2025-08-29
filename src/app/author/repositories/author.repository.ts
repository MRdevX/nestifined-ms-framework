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
    return this.repository.find({
      relations: ["books"],
    });
  }

  async findByIdWithBooks(id: string): Promise<Author | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["books"],
    });
  }
}
