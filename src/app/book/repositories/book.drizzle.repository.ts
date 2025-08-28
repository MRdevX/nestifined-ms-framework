import { Injectable } from "@nestjs/common";
import { and, eq, gte, like } from "drizzle-orm";
import { DrizzleBaseRepository } from "../../core/base/drizzle/drizzle.base.repository";
import type { DrizzleBook, DrizzleBookWithAuthor } from "../../core/base/drizzle/drizzle.entities";
import { DrizzleDatabase } from "../../core/database/drizzle.config";
import { authors, books } from "../../core/database/drizzle.schema";

@Injectable()
export class BookDrizzleRepository extends DrizzleBaseRepository<DrizzleBook> {
  constructor(drizzleDb: DrizzleDatabase) {
    super(drizzleDb.getDatabase(), books);
  }

  async findByIsbn(isbn: string): Promise<DrizzleBook | null> {
    const result = await this.db.select().from(books).where(eq(books.isbn, isbn)).limit(1);

    return (result[0] as DrizzleBook) || null;
  }

  async findByTitle(title: string): Promise<DrizzleBook[]> {
    const result = await this.db
      .select()
      .from(books)
      .where(like(books.title, `%${title}%`));

    return result as DrizzleBook[];
  }

  async findByAuthorId(authorId: string): Promise<DrizzleBook[]> {
    const result = await this.db.select().from(books).where(eq(books.authorId, authorId));

    return result as DrizzleBook[];
  }

  async findPublishedAfter(date: Date): Promise<DrizzleBook[]> {
    const result = await this.db.select().from(books).where(gte(books.publishedDate, date));

    return result as DrizzleBook[];
  }

  async findByIdWithAuthor(id: string): Promise<DrizzleBookWithAuthor | null> {
    const bookResult = await this.db.select().from(books).where(eq(books.id, id)).limit(1);

    if (!bookResult[0]) {
      return null;
    }

    const authorResult = await this.db.select().from(authors).where(eq(authors.id, bookResult[0].authorId)).limit(1);

    const book = bookResult[0] as DrizzleBook;
    const author = authorResult[0] as any;

    return {
      ...book,
      author: author,
    } as DrizzleBookWithAuthor;
  }
}
