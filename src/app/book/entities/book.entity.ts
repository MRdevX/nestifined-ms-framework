import { Author } from '@root/app/author/entities/author.entity';
import { TypeOrmBaseModel } from '@root/app/core/base/typeorm/typeorm.base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('books')
export class Book extends TypeOrmBaseModel {
  @Column()
  title: string;

  @ManyToOne(
    () => Author,
    (author) => author.books,
  )
  author: Author;

  @Column()
  isbn: string;

  @Column()
  summary: string;

  @Column({ nullable: true, type: 'timestamp' })
  publishedDate?: Date;
}
