import { Entity, Column } from 'typeorm';
import { BaseModel } from '@root/app/core/entities/base.entity';

@Entity()
export class Book extends BaseModel {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publishedDate: Date;

  @Column()
  isbn: string;

  @Column()
  summary: string;
}
