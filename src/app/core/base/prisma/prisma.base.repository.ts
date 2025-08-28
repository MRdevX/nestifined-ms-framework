import type { BaseModel } from "../base.entity";
import type {
  IBaseRepository,
  IFindOptions,
  IPaginatedResult,
  IPaginationOptions,
  IWhereClause,
} from "../interfaces/base.interface";

export abstract class PrismaBaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(protected readonly prisma: unknown) {}

  async create(data: Partial<T>): Promise<T> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async findById(id: string): Promise<T | null> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<T | null> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    //

    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async findMany(where: IWhereClause): Promise<T[]> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async findWithPagination(where: IWhereClause = {}, options: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async count(where: IWhereClause = {}): Promise<number> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async exists(where: IWhereClause): Promise<boolean> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async hardDelete(id: string): Promise<boolean> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }

  async restore(id: string): Promise<boolean> {
    throw new Error("Prisma implementation not provided - this is just an example");
  }
}
