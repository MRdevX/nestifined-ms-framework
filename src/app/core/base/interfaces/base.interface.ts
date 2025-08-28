export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IBaseEntityData {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IWhereClause {
  [key: string]: any;
}

export interface IOrderClause {
  [key: string]: 'ASC' | 'DESC';
}

export interface IPaginationOptions {
  skip?: number;
  take?: number;
  order?: IOrderClause;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface IFindOptions {
  where?: IWhereClause;
  relations?: string[];
  select?: string[];
  order?: IOrderClause;
  skip?: number;
  take?: number;
}

export interface IBaseRepository<T extends IBaseEntity> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findByIdWithRelations(id: string, relations?: string[]): Promise<T | null>;
  findAll(options?: IFindOptions): Promise<T[]>;
  findMany(where: IWhereClause): Promise<T[]>;
  findWithPagination(where?: IWhereClause, options?: IPaginationOptions): Promise<IPaginatedResult<T>>;
  count(where?: IWhereClause): Promise<number>;
  exists(where: IWhereClause): Promise<boolean>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
