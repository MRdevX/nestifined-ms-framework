import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from '../author.controller';
import { AuthorService } from '../author.service';
import { CreateAuthorDto, UpdateAuthorDto } from '../dto';

describe('AuthorController', () => {
  let controller: AuthorController;

  const mockAuthorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [{ provide: AuthorService, useValue: mockAuthorService }],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Author Name' };
      const author = { id: uuidv4(), ...createAuthorDto };

      mockAuthorService.create.mockResolvedValue(author);

      const result = await controller.create(createAuthorDto);
      expect(result).toEqual(author);
      expect(mockAuthorService.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const authors = [{ id: uuidv4(), name: 'Author Name' }];
      mockAuthorService.findAll.mockResolvedValue(authors);

      const result = await controller.findAll();
      expect(result).toEqual(authors);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author', async () => {
      const author = { id: uuidv4(), name: 'Author Name' };
      mockAuthorService.findOne.mockResolvedValue(author);

      const result = await controller.findOne(author.id);
      expect(result).toEqual(author);
      expect(mockAuthorService.findOne).toHaveBeenCalledWith(author.id);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Updated Author Name' };
      const author = { id: uuidv4(), ...updateAuthorDto };

      mockAuthorService.update.mockResolvedValue(author);

      const result = await controller.update(author.id, updateAuthorDto);
      expect(result).toEqual(author);
      expect(mockAuthorService.update).toHaveBeenCalledWith(author.id, updateAuthorDto);
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      const author = { id: uuidv4(), name: 'Author Name' };

      mockAuthorService.remove.mockResolvedValue(undefined);

      await controller.remove(author.id);
      expect(mockAuthorService.remove).toHaveBeenCalledWith(author.id);
    });
  });
});
