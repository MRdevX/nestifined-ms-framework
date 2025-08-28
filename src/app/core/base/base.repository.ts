import type { BaseModel } from './base.entity';
import type {
  IBaseRepository,
  IFindOptions,
  IPaginatedResult,
  IPaginationOptions,
  IWhereClause,
} from './interfaces/base.interface';

export abstract class BaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findByIdWithRelations(id: string, relations?: string[]): Promise<T | null>;
  abstract findAll(options?: IFindOptions): Promise<T[]>;
  abstract findMany(where: IWhereClause): Promise<T[]>;
  abstract findWithPagination(where?: IWhereClause, options?: IPaginationOptions): Promise<IPaginatedResult<T>>;
  abstract count(where?: IWhereClause): Promise<number>;
  abstract exists(where: IWhereClause): Promise<boolean>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract hardDelete(id: string): Promise<boolean>;
  abstract restore(id: string): Promise<boolean>;
}
