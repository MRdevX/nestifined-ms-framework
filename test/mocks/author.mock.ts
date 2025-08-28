import { Author } from '@root/app/author/entities/author.entity';
import { v4 as uuidv4 } from 'uuid';
import { createMockEntity } from './base.mock';

export const createMockAuthor = (): Author =>
  createMockEntity(Author, {
    id: uuidv4(),
    name: 'Author Name',
    books: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
