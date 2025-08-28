import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const baseFields = {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
} as const;

export const users = pgTable(
  "users",
  {
    ...baseFields,
    email: varchar("email", { length: 100 }),
    name: varchar("name", { length: 120 }),
    password: varchar("password", { length: 255 }),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const authors = pgTable(
  "authors",
  {
    ...baseFields,
    name: varchar("name", { length: 255 }).notNull(),
  },
  (table) => ({
    nameIdx: index("authors_name_idx").on(table.name),
  }),
);

export const books = pgTable(
  "books",
  {
    ...baseFields,
    title: varchar("title", { length: 255 }).notNull(),
    isbn: varchar("isbn", { length: 50 }).notNull(),
    summary: text("summary").notNull(),
    publishedDate: timestamp("published_date"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id),
  },
  (table) => ({
    titleIdx: index("books_title_idx").on(table.title),
    isbnIdx: index("books_isbn_idx").on(table.isbn),
    authorIdIdx: index("books_author_id_idx").on(table.authorId),
  }),
);

export const tokens = pgTable(
  "tokens",
  {
    ...baseFields,
    token: varchar("token", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => ({
    tokenIdx: index("tokens_token_idx").on(table.token),
    userIdIdx: index("tokens_user_id_idx").on(table.userId),
    typeIdx: index("tokens_type_idx").on(table.type),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

export const tables = {
  users,
  authors,
  books,
  tokens,
} as const;
