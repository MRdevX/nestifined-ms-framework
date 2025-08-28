import { faker } from '@faker-js/faker';
import type { Author } from '@root/app/author/entities/author.entity';
import type { Book } from '@root/app/book/entities/book.entity';
import { v4 as uuidv4 } from 'uuid';

export const createMockBook = (author: Author): Partial<Book> => ({
  id: uuidv4(),
  title: faker.lorem.words(3),
  author,
  isbn: faker.string.uuid(),
  summary: faker.lorem.paragraph(),
  publishedDate: faker.date.past(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
});
