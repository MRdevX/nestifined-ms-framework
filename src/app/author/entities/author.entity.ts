import { Book } from "@root/app/book/entities/book.entity";
import { TypeOrmBaseModel } from "@root/app/core/base/typeorm/typeorm.base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("authors")
export class Author extends TypeOrmBaseModel {
  @Column()
  name: string;

  @OneToMany(
    () => Book,
    (book) => book.author,
  )
  books: Book[];
}
