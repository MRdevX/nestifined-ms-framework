import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';
import { merge, isNil } from 'lodash';

interface ISearchConfig {
  caseInsensitiveSearch?: boolean;
  fullTextSearch?: boolean;
  withDeleted?: boolean;
  andWhere?: { condition: string; parameters?: any };
}

interface IBaseEntitySearchDto<T> {
  limit?: number;
  offset?: number;
  relations?: string[];
  filterFields?: Array<{ name: keyof T; value: any }>;
  searchInput?: string;
  searchFields?: Array<keyof T>;
  selectFields?: Array<keyof T>;
  sortFields?: Array<keyof T>;
  sortDirections?: Array<'ASC' | 'DESC'>;
}

export abstract class SearchService<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  private static get defaultSearchConfig(): ISearchConfig {
    return {
      caseInsensitiveSearch: true,
      fullTextSearch: true,
      withDeleted: false,
    };
  }

  private static getSortVerb(direction: 'ASC' | 'DESC'): 'ASC' | 'DESC' {
    return direction === 'DESC' ? 'DESC' : 'ASC';
  }

  private applyRelations(qb: SelectQueryBuilder<T>, alias: string, relations?: string[]): void {
    relations?.forEach((relation) => qb.leftJoinAndSelect(`${alias}.${relation}`, relation));
  }

  private applyFilters(
    qb: SelectQueryBuilder<T>,
    alias: string,
    filterFields?: Array<{ name: keyof T; value: any }>,
  ): void {
    filterFields?.forEach((filter) => {
      if (!isNil(filter.value)) {
        qb.andWhere(`${alias}.${String(filter.name)} = :${String(filter.name)}`, { [filter.name]: filter.value });
      }
    });
  }

  private applySearch(
    qb: SelectQueryBuilder<T>,
    alias: string,
    searchInput?: string,
    searchFields?: Array<keyof T>,
    searchConfig?: ISearchConfig,
  ): void {
    if (searchInput && searchFields?.length) {
      const query = searchConfig?.fullTextSearch ? `%${searchInput}%` : searchInput;
      const operator = searchConfig?.caseInsensitiveSearch ? 'ILIKE' : 'LIKE';

      const brackets = new Brackets((qb) => {
        searchFields.forEach((field) => qb.orWhere(`${alias}.${String(field)} ${operator} :query`, { query }));
      });
      qb.andWhere(brackets);
    }
  }

  private applySorting(
    qb: SelectQueryBuilder<T>,
    alias: string,
    sortFields?: Array<keyof T>,
    sortDirections?: Array<'ASC' | 'DESC'>,
  ): void {
    sortFields?.forEach((column, i) => {
      const direction = (sortDirections && SearchService.getSortVerb(sortDirections[i])) || 'ASC';
      qb.addOrderBy(`${alias}.${String(column)}`, direction);
    });
  }

  public async search(
    options: IBaseEntitySearchDto<T>,
    config: ISearchConfig = {},
  ): Promise<{ items: T[]; total: number }> {
    const searchConfig: ISearchConfig = merge(SearchService.defaultSearchConfig, config);
    const {
      limit,
      offset,
      relations,
      filterFields,
      searchInput,
      searchFields,
      selectFields,
      sortFields,
      sortDirections,
    } = options;
    const alias = this.repository.metadata.targetName;
    const qb = this.repository.createQueryBuilder(alias);

    this.applyRelations(qb, alias, relations);
    this.applyFilters(qb, alias, filterFields);
    this.applySearch(qb, alias, searchInput, searchFields, searchConfig);
    this.applySorting(qb, alias, sortFields, sortDirections);

    if (searchConfig.andWhere) {
      qb.andWhere(searchConfig.andWhere.condition, searchConfig.andWhere.parameters);
    }

    if (selectFields?.length) {
      qb.select(selectFields.map((col) => `${alias}.${String(col)}`));
    }

    if (searchConfig.withDeleted) {
      qb.withDeleted();
    } else {
      qb.andWhere(`${alias}.deletedAt IS NULL`);
    }

    try {
      const [items, total] = await qb.take(limit).skip(offset).getManyAndCount();
      return { items, total };
    } catch (error) {
      throw new Error(`Failed to execute search query: ${error.message}`);
    }
  }
}
