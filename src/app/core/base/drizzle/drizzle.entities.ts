import type { BaseModel } from "../base.entity";

export interface DrizzleUser extends BaseModel {
  email?: string;
  name?: string;
  password?: string;
}

export interface DrizzleAuthor extends BaseModel {
  name: string;
}

export interface DrizzleBook extends BaseModel {
  title: string;
  isbn: string;
  summary: string;
  publishedDate?: Date;
  authorId: string;
}

export interface DrizzleToken extends BaseModel {
  token: string;
  type: string;
  userId: string;
  expiresAt: Date;
}

export interface DrizzleAuthorWithBooks extends DrizzleAuthor {
  books: DrizzleBook[];
}

export interface DrizzleBookWithAuthor extends DrizzleBook {
  author: DrizzleAuthor;
}
