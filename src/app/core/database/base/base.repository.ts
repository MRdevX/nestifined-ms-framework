import { Injectable } from "@nestjs/common";
import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm";
import {
  BaseRepository,
  FilterOptions,
  PaginationOptions,
  PaginationResult,
  SearchOptions,
} from "../interfaces/database.interface";
import { QueryUtils } from "../utils/query.utils";

@Injectable()
export abstract class TypeOrmBaseRepository<T> implements BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async restore(id: string): Promise<T | null> {
    const result = await this.repository.restore(id);
    if (result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async search(options?: SearchOptions): Promise<T[] | PaginationResult<T>> {
    const {
      pagination,
      filters = {},
      relations = [],
      select = [],
      withPagination = false,
      includeDeleted = false,
    } = options || {};

    const queryBuilder = this.buildQueryBuilder(filters, relations, select, includeDeleted);

    if (withPagination && pagination?.sortBy) {
      queryBuilder.orderBy(`${this.getTableAlias()}.${pagination.sortBy}`, pagination.sortOrder || "DESC");
    }

    if (withPagination && pagination) {
      return this.getPaginatedResults(queryBuilder, pagination);
    }

    return queryBuilder.getMany();
  }

  async count(filters?: FilterOptions): Promise<number> {
    const queryBuilder = this.buildQueryBuilder(filters || {});
    return queryBuilder.getCount();
  }

  private async getPaginatedResults(
    queryBuilder: SelectQueryBuilder<T>,
    pagination: PaginationOptions,
  ): Promise<PaginationResult<T>> {
    const page = Math.max(1, Math.min(10000, pagination.page || 1));
    const limit = Math.max(1, Math.min(100, pagination.limit || 10));
    const skip = Math.min(1000000, (page - 1) * limit);

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  protected buildQueryBuilder(
    filters: FilterOptions,
    relations: string[] = [],
    select: string[] = [],
    includeDeleted: boolean = false,
  ): SelectQueryBuilder<T> {
    const tableAlias = this.getTableAlias();
    let queryBuilder = this.repository.createQueryBuilder(tableAlias);

    relations.forEach((relation) => {
      queryBuilder = queryBuilder.leftJoinAndSelect(`${tableAlias}.${relation}`, relation);
    });

    if (select.length > 0) {
      const selectFields = select.map((field) => `${tableAlias}.${field}`);
      queryBuilder = queryBuilder.select(selectFields);
    }

    if (!includeDeleted) {
      queryBuilder.andWhere(`${tableAlias}.deletedAt IS NULL`);
    }

    this.applyFilters(queryBuilder, filters, tableAlias);

    return queryBuilder;
  }

  protected applyFilters(queryBuilder: SelectQueryBuilder<T>, filters: FilterOptions, tableAlias: string): void {
    Object.entries(filters).forEach(([key, value], index) => {
      if (value !== undefined && value !== null && value !== "") {
        const parameterName = `${key}_${index}`;

        if (key === "search" && typeof value === "string") {
          this.applySearchFilter(queryBuilder, value, tableAlias);
          return;
        }

        if (typeof value === "string" && (value.startsWith(">=") || value.startsWith("<="))) {
          const dateFilter = QueryUtils.parseDateFilter(value);
          if (dateFilter) {
            queryBuilder.andWhere(`${tableAlias}.${key} ${dateFilter.operator} :${parameterName}`, {
              [parameterName]: dateFilter.date,
            });
          }
          return;
        }

        if (Array.isArray(value)) {
          queryBuilder.andWhere(`${tableAlias}.${key} IN (:...${parameterName})`, { [parameterName]: value });
          return;
        }

        if (typeof value === "string" && value.includes("%")) {
          queryBuilder.andWhere(`${tableAlias}.${key} ILIKE :${parameterName}`, { [parameterName]: value });
          return;
        }

        if (typeof value === "string") {
          queryBuilder.andWhere(`${tableAlias}.${key} ILIKE :${parameterName}`, { [parameterName]: `%${value}%` });
          return;
        }

        queryBuilder.andWhere(`${tableAlias}.${key} = :${parameterName}`, { [parameterName]: value });
      }
    });
  }

  protected applySearchFilter(queryBuilder: SelectQueryBuilder<T>, searchTerm: string, tableAlias: string): void {
    const searchableFields = this.getSearchableFields();
    if (searchableFields.length === 0) return;

    const searchConditions = searchableFields.map((field, index) => {
      const parameterName = `search_${index}`;
      return `${tableAlias}.${field} ILIKE :${parameterName}`;
    });

    const searchQuery = searchConditions.join(" OR ");
    const searchParams = searchableFields.reduce(
      (params, field, index) => {
        params[`search_${index}`] = `%${searchTerm}%`;
        return params;
      },
      {} as Record<string, string>,
    );

    queryBuilder.andWhere(`(${searchQuery})`, searchParams);
  }

  protected getSearchableFields(): string[] {
    return [];
  }

  protected getTableAlias(): string {
    return this.repository.metadata.name.toLowerCase();
  }
}
