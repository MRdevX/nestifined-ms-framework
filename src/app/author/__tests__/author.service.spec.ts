import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '@root/app/author/entities/author.entity';
import { AuthorService } from '../author.service';
import { ERRORS } from '../../core/errors/errors';

const mockAuthorRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorService, { provide: getRepositoryToken(Author), useValue: mockAuthorRepository() }],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<MockRepository>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto = { name: 'Author Name' };
      const author = { id: uuidv4(), ...createAuthorDto };

      repository.create.mockReturnValue(author);
      repository.save.mockResolvedValue(author);

      const result = await service.create(createAuthorDto);
      expect(result).toEqual(author);
      expect(repository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(repository.save).toHaveBeenCalledWith(author);
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const authors = [{ id: uuidv4(), name: 'Author Name' }];
      repository.find.mockResolvedValue(authors);

      const result = await service.findAll();
      expect(result).toEqual(authors);
      expect(repository.find).toHaveBeenCalledWith({ where: { deletedAt: null }, relations: ['books'] });
    });
  });

  describe('findOne', () => {
    it('should return an author', async () => {
      const author = { id: uuidv4(), name: 'Author Name' };
      repository.findOne.mockResolvedValue(author);

      const result = await service.findOne(author.id);
      expect(result).toEqual(author);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: author.id, deletedAt: null },
        relations: ['books'],
      });
    });
    it('should throw an error if author not found', async () => {
      const authorId = uuidv4();
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(authorId)).rejects.toThrow(ERRORS.AUTHOR.NOT_FOUND.message);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateAuthorDto = { name: 'Updated Author Name' };
      const author = { id: uuidv4(), ...updateAuthorDto };

      repository.preload.mockResolvedValue(author);
      repository.save.mockResolvedValue(author);

      const result = await service.update(author.id, updateAuthorDto);
      expect(result).toEqual(author);
      expect(repository.preload).toHaveBeenCalledWith({ id: author.id, ...updateAuthorDto });
      expect(repository.save).toHaveBeenCalledWith(author);
    });

    it('should throw an error if author not found', async () => {
      const authorId = uuidv4();
      repository.preload.mockResolvedValue(null);

      await expect(service.update(authorId, { name: 'Updated Author Name' })).rejects.toThrow(
        ERRORS.AUTHOR.NOT_FOUND.message,
      );
    });
  });

  describe('remove', () => {
    it('should mark an author as deleted', async () => {
      const author = { id: uuidv4(), name: 'Author Name' };
      repository.findOne.mockResolvedValue(author);
      repository.save.mockResolvedValue({ ...author, deletedAt: new Date() });

      await service.remove(author.id);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: author.id, deletedAt: null },
        relations: ['books'],
      });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ deletedAt: expect.any(Date) }));
    });
  });
});
