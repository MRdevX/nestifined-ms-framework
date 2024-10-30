import { v4 as uuidv4 } from 'uuid';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from '../author.controller';
import { AuthorService } from '../author.service';
import { CreateAuthorDto, UpdateAuthorDto } from '../dto';
import { Author } from '../entities/author.entity';

describe('AuthorController', () => {
  let controller: AuthorController;
  let authorService: MockProxy<AuthorService>;

  beforeEach(async () => {
    authorService = mock<AuthorService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [{ provide: AuthorService, useValue: authorService }],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Author Name' };
      const author: Partial<Author> = { id: uuidv4(), ...createAuthorDto };

      authorService.create.mockResolvedValue(author as Author);

      const result = await controller.create(createAuthorDto);
      expect(result).toEqual(author);
      expect(authorService.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const authors: Partial<Author>[] = [{ id: uuidv4(), name: 'Author Name' }];
      authorService.findAll.mockResolvedValue(authors as Author[]);

      const result = await controller.findAll();
      expect(result).toEqual(authors);
      expect(authorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author', async () => {
      const author: Partial<Author> = { id: uuidv4(), name: 'Author Name' };
      authorService.findOne.mockResolvedValue(author as Author);

      const result = await controller.findOne(author.id as string);
      expect(result).toEqual(author);
      expect(authorService.findOne).toHaveBeenCalledWith(author.id);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Updated Author Name' };
      const author: Partial<Author> = { id: uuidv4(), ...updateAuthorDto };

      authorService.update.mockResolvedValue(author as Author);

      const result = await controller.update(author.id as string, updateAuthorDto);
      expect(result).toEqual(author);
      expect(authorService.update).toHaveBeenCalledWith(author.id, updateAuthorDto);
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      const author: Partial<Author> = { id: uuidv4(), name: 'Author Name' };

      authorService.remove.mockResolvedValue(undefined);

      await controller.remove(author.id as string);
      expect(authorService.remove).toHaveBeenCalledWith(author.id);
    });
  });
});
