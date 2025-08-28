import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DrizzleBaseRepository } from "../../core/base/drizzle/drizzle.base.repository";
import type { DrizzleAuthor, DrizzleAuthorWithBooks } from "../../core/base/drizzle/drizzle.entities";
import type { Database } from "../../core/database/drizzle.config";
import { authors, books } from "../../core/database/drizzle.schema";

@Injectable()
export class AuthorDrizzleRepository extends DrizzleBaseRepository<DrizzleAuthor> {
  constructor(@Inject("DATABASE") db: Database) {
    super(db, authors);
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<DrizzleAuthor | null> {
    if (relations.includes("books")) {
      return this.findByIdWithBooks(id);
    }
    return this.findById(id);
  }

  async findByName(name: string): Promise<DrizzleAuthor | null> {
    const result = await this.db.select().from(authors).where(eq(authors.name, name)).limit(1);

    return (result[0] as DrizzleAuthor) || null;
  }

  async findByIdWithBooks(id: string): Promise<DrizzleAuthorWithBooks | null> {
    const authorResult = await this.db.select().from(authors).where(eq(authors.id, id)).limit(1);

    if (!authorResult[0]) {
      return null;
    }

    const booksResult = await this.db.select().from(books).where(eq(books.authorId, id));

    const author = authorResult[0] as DrizzleAuthor;
    const authorBooks = booksResult as any[];

    return {
      ...author,
      books: authorBooks,
    } as DrizzleAuthorWithBooks;
  }
}
