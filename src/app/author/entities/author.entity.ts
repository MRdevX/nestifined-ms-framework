import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/app/core/entities/base.entity';
import { Book } from '@root/app/book/entities/book.entity';

@Entity('authors')
export class Author extends BaseModel {
  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
