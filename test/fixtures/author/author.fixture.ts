import { faker } from "@faker-js/faker";
import type { Author } from "@root/app/author/entities/author.entity";
import { v4 as uuidv4 } from "uuid";

export const createMockAuthor = (): Partial<Author> => ({
  id: uuidv4(),
  name: faker.person.fullName(),
  books: [],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
