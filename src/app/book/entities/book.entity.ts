import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/app/core/entities/base.entity';
import { Author } from '@root/app/author/entities/author.entity';

@Entity('books')
export class Book extends BaseModel {
  @Column()
  title: string;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @Column()
  isbn: string;

  @Column()
  summary: string;

  @Column({ nullable: true, type: 'timestamp' })
  publishedDate?: Date;
}
