import { and, asc, count, desc, eq, SQL } from "drizzle-orm";
import type { Database } from "../../database/drizzle/drizzle.config";
import type { BaseModel } from "../base.entity";
import type {
  IBaseRepository,
  IFindOptions,
  IOrderClause,
  IPaginatedResult,
  IPaginationOptions,
  IWhereClause,
} from "../interfaces/base.interface";

export abstract class DrizzleBaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(
    protected readonly db: Database,
    protected readonly table: any,
  ) {}

  async create(data: Partial<T>): Promise<T> {
    const now = new Date();
    const insertData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.db
      .insert(this.table)
      .values(insertData as any)
      .returning();
    return result[0] as T;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1);
    return (result[0] as T) || null;
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<T | null> {
    return this.findById(id);
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    let query = this.db.select().from(this.table);

    if (options?.where) {
      const conditions = this.buildWhereConditions(options.where);
      if (conditions) {
        query = (query as any).where(conditions);
      }
    }

    if (options?.order) {
      query = this.applyOrderClause(query, options.order);
    }

    if (options?.skip) {
      query = (query as any).offset(options.skip);
    }

    if (options?.take) {
      query = (query as any).limit(options.take);
    }

    const result = await query;
    return result as T[];
  }

  async findMany(where: IWhereClause): Promise<T[]> {
    const conditions = this.buildWhereConditions(where);
    const query = conditions ? this.db.select().from(this.table).where(conditions) : this.db.select().from(this.table);

    const result = await query;
    return result as T[];
  }

  async findWithPagination(where: IWhereClause = {}, options: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
    const { skip = 0, take = 10, order = { createdAt: "DESC" } as IOrderClause } = options;

    const total = await this.count(where);

    let query = this.db.select().from(this.table);

    const conditions = this.buildWhereConditions(where);
    if (conditions) {
      query = (query as any).where(conditions);
    }

    query = this.applyOrderClause(query, order);
    query = (query as any).offset(skip).limit(take);

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
    const conditions = this.buildWhereConditions(where);
    const query = conditions
      ? this.db.select({ count: count() }).from(this.table).where(conditions)
      : this.db.select({ count: count() }).from(this.table);

    const result = await query;
    return result[0]?.count || 0;
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

    const result = await this.db.update(this.table).set(updateData).where(eq(this.table.id, id)).returning();
    return (result[0] as T) || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.update(this.table).set({ deletedAt: new Date() }).where(eq(this.table.id, id));
    return result.rowCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.db.delete(this.table).where(eq(this.table.id, id));
    return result.rowCount > 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.db.update(this.table).set({ deletedAt: null }).where(eq(this.table.id, id));
    return result.rowCount > 0;
  }

  protected applyOrderClause(query: any, order: IOrderClause): any {
    Object.entries(order).forEach(([key, direction]) => {
      const column = (this.table as any)[key];
      if (column && typeof column === "object") {
        if (direction === "ASC") {
          query = query.orderBy(asc(column));
        } else {
          query = query.orderBy(desc(column));
        }
      }
    });
    return query;
  }

  protected buildWhereConditions(where: IWhereClause): SQL | undefined {
    const conditions = Object.entries(where)
      .map(([key, value]) => {
        const column = (this.table as any)[key];
        if (column && typeof column === "object" && "eq" in column) {
          return eq(column, value);
        }
        return null;
      })
      .filter(Boolean) as SQL[];

    return conditions.length > 0 ? and(...conditions) : undefined;
  }
}
