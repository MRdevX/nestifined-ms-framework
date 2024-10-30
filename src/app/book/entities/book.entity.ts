import { Entity, Column } from 'typeorm';
import { BaseModel } from '@root/app/core/entities/base.entity';

@Entity('books')
export class Book extends BaseModel {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  isbn: string;

  @Column()
  summary: string;

  @Column({ nullable: true, type: 'timestamp' })
  publishedDate?: Date;
}
