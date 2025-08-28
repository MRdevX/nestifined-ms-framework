import type { BaseModel } from "../base.entity";
import type {
  IBaseRepository,
  IFindOptions,
  IOrderClause,
  IPaginatedResult,
  IPaginationOptions,
  IWhereClause,
} from "../interfaces/base.interface";

export interface DrizzleDatabase {
  select: () => any;
  insert: (table: any) => any;
  update: (table: any) => any;
  delete: (table: any) => any;
}

export interface DrizzleTable {
  [key: string]: any;
}

export abstract class DrizzleBaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(
    protected readonly db: DrizzleDatabase,
    protected readonly table: DrizzleTable,
  ) {}

  async create(data: Partial<T>): Promise<T> {
    const now = new Date();
    const insertData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.db.insert(this.table).values(insertData).returning();
    return result[0] as T;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.db.select().from(this.table).where(this.table.id.eq(id)).limit(1);
    return (result[0] as T) || null;
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<T | null> {
    return this.findById(id);
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    let query = this.db.select().from(this.table);

    if (options?.where) {
      query = this.applyWhereClause(query, options.where);
    }

    if (options?.order) {
      query = this.applyOrderClause(query, options.order);
    }

    if (options?.skip) {
      query = query.offset(options.skip);
    }

    if (options?.take) {
      query = query.limit(options.take);
    }

    const result = await query;
    return result as T[];
  }

  async findMany(where: IWhereClause): Promise<T[]> {
    let query = this.db.select().from(this.table);
    query = this.applyWhereClause(query, where);
    const result = await query;
    return result as T[];
  }

  async findWithPagination(where: IWhereClause = {}, options: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
    const { skip = 0, take = 10, order = { createdAt: "DESC" } as IOrderClause } = options;

    const total = await this.count(where);

    let query = this.db.select().from(this.table);
    query = this.applyWhereClause(query, where);
    query = this.applyOrderClause(query, order);
    query = query.offset(skip).limit(take);

    const data = await query;

    return {
      data: data as T[],
      total,
      skip,
      take,
      hasMore: skip + take < total,
    };
  }

  async count(where: IWhereClause = {}): Promise<number> {
    const allRecords = await this.findMany(where);
    return allRecords.length;
  }

  async exists(where: IWhereClause): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await this.db.update(this.table).set(updateData).where(this.table.id.eq(id)).returning();
    return (result[0] as T) || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.update(this.table).set({ deletedAt: new Date() }).where(this.table.id.eq(id));
    return result.rowCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.db.delete(this.table).where(this.table.id.eq(id));
    return result.rowCount > 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.db.update(this.table).set({ deletedAt: null }).where(this.table.id.eq(id));
    return result.rowCount > 0;
  }

  protected applyWhereClause(query: any, where: IWhereClause): any {
    Object.entries(where).forEach(([key, value]) => {
      if (this.table[key]) {
        query = query.where(this.table[key].eq(value));
      }
    });
    return query;
  }

  protected applyOrderClause(query: any, order: IOrderClause): any {
    Object.entries(order).forEach(([key, direction]) => {
      if (this.table[key]) {
        if (direction === "ASC") {
          query = query.orderBy(this.table[key].asc());
        } else {
          query = query.orderBy(this.table[key].desc());
        }
      }
    });
    return query;
  }
}
