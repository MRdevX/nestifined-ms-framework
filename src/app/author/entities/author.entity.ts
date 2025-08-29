import { Book } from "@root/app/book/entities/book.entity";
import { BaseEntity } from "@root/app/core/database/base/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("authors")
export class Author extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => Book,
    (book) => book.author,
  )
  books: Book[];
}
