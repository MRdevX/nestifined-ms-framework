import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "../interfaces/database.interface";

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

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
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
}
