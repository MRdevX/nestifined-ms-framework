import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '../../core/base/typeorm/typeorm.base.repository';
import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorRepository extends TypeOrmBaseRepository<Author> {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {
    super(authorRepo);
  }

  async findByName(name: string): Promise<Author | null> {
    return this.authorRepo.findOne({
      where: { name },
    });
  }

  async findAllWithBooks(): Promise<Author[]> {
    return this.authorRepo.find({
      relations: ['books'],
    });
  }

  async findByIdWithBooks(id: string): Promise<Author | null> {
    return this.authorRepo.findOne({
      where: { id },
      relations: ['books'],
    });
  }
}
