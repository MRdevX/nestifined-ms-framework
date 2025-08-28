import type { DeepPartial, FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";
import type { BaseModel } from "../base.entity";
import type {
  IBaseRepository,
  IFindOptions,
  IOrderClause,
  IPaginatedResult,
  IPaginationOptions,
  IWhereClause,
} from "../interfaces/base.interface";

export abstract class TypeOrmBaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    const typeOrmOptions: FindManyOptions<T> = {};

    if (options?.where) {
      typeOrmOptions.where = options.where as FindOptionsWhere<T>;
    }
    if (options?.relations) {
      typeOrmOptions.relations = options.relations;
    }
    if (options?.select) {
      typeOrmOptions.select = options.select as any;
    }
    if (options?.order) {
      typeOrmOptions.order = options.order as FindOptionsOrder<T>;
    }
    if (options?.skip) {
      typeOrmOptions.skip = options.skip;
    }
    if (options?.take) {
      typeOrmOptions.take = options.take;
    }

    return this.repository.find(typeOrmOptions);
  }

  async findMany(where: IWhereClause): Promise<T[]> {
    return this.repository.find({ where: where as FindOptionsWhere<T> });
  }

  async findWithPagination(where: IWhereClause = {}, options: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
    const { skip = 0, take = 10, order = { createdAt: "DESC" } as IOrderClause } = options;

    const [data, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<T>,
      skip,
      take,
      order: order as FindOptionsOrder<T>,
    });

    return {
      data,
      total,
      skip,
      take,
      hasMore: skip + take < total,
    };
  }

  async count(where: IWhereClause = {}): Promise<number> {
    return this.repository.count({ where: where as FindOptionsWhere<T> });
  }

  async exists(where: IWhereClause): Promise<boolean> {
    const count = await this.repository.count({ where: where as FindOptionsWhere<T> });
    return count > 0;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore(id);
    return (result.affected || 0) > 0;
  }
}
