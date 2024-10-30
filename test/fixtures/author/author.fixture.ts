import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Author } from '@root/app/author/entities/author.entity';

export const createMockAuthor = (): Partial<Author> => ({
  id: uuidv4(),
  name: faker.person.fullName(),
  books: [],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
