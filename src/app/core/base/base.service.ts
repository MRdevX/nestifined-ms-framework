import { Injectable, NotFoundException } from "@nestjs/common";
import type { BaseModel } from "./base.entity";
import type { IBaseRepository, IFindOptions, IWhereClause } from "./interfaces/base.interface";

@Injectable()
export abstract class BaseService<T extends BaseModel> {
  constructor(protected readonly repository: IBaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<T> {
    const entity = await this.repository.findByIdWithRelations(id, relations);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findMany(where: IWhereClause): Promise<T[]> {
    return this.repository.findMany(where);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updatedEntity = await this.repository.update(id, data);
    if (!updatedEntity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists({ id });
  }
}
