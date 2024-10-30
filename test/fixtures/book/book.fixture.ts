import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Book } from '@root/app/book/entities/book.entity';
import { Author } from '@root/app/author/entities/author.entity';

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
