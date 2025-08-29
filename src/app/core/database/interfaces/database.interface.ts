import { DataSourceOptions } from "typeorm";

export interface DatabaseConfig {
  type: "postgres" | "mysql" | "mariadb" | "sqlite" | "oracle" | "mssql";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  maxConnections?: number;
  entities?: DataSourceOptions["entities"];
  logging?: DataSourceOptions["logging"];
}

export interface DatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterOptions {
  [key: string]: unknown;
}

export interface SearchOptions {
  pagination?: PaginationOptions;
  filters?: FilterOptions;
  relations?: string[];
  select?: string[];
  withPagination?: boolean;
  includeDeleted?: boolean;
}

export interface BaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<T | null>;
  search(options?: SearchOptions): Promise<T[] | PaginationResult<T>>;
  count(filters?: FilterOptions): Promise<number>;
}
