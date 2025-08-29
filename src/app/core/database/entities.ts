import { Token } from "@root/app/auth/entities/token.entity";
import { Author } from "@root/app/author/entities/author.entity";
import { Book } from "@root/app/book/entities/book.entity";
import { User } from "@root/app/users/entities/user.entity";

export const entities = [Book, Author, User, Token];
