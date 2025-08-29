import { Injectable, NotFoundException } from "@nestjs/common";
import {
  BaseRepository,
  FilterOptions,
  PaginationOptions,
  PaginationResult,
  SearchOptions,
} from "../interfaces/database.interface";

@Injectable()
export abstract class BaseService<T> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }

  async search(options?: SearchOptions): Promise<T[] | PaginationResult<T>> {
    return this.repository.search(options);
  }

  async count(filters?: FilterOptions): Promise<number> {
    return this.repository.count(filters);
  }

  async searchWithPagination(
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder: "ASC" | "DESC" = "DESC",
    filters?: FilterOptions,
    relations?: string[],
  ): Promise<PaginationResult<T>> {
    const options: SearchOptions = {
      pagination: { page, limit, sortBy, sortOrder },
      filters,
      relations,
      withPagination: true,
    };
    return this.repository.search(options) as Promise<PaginationResult<T>>;
  }

  async searchWithFilters(filters: FilterOptions, relations?: string[], select?: string[]): Promise<T[]> {
    const options: SearchOptions = {
      filters,
      relations,
      select,
      withPagination: false,
    };
    return this.repository.search(options) as Promise<T[]>;
  }

  async searchWithRelations(relations: string[], filters?: FilterOptions, select?: string[]): Promise<T[]> {
    const options: SearchOptions = {
      filters,
      relations,
      select,
      withPagination: false,
    };
    return this.repository.search(options) as Promise<T[]>;
  }

  async findAll(relations?: string[], select?: string[]): Promise<T[]> {
    return this.search({
      relations,
      select,
      withPagination: false,
    }) as Promise<T[]>;
  }
}
