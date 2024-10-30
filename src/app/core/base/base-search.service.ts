import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';
import { merge, isNil } from 'lodash';
import { ISearchConfig, IFilterField, IBaseEntitySearchDto, QueryNarrowingOperators } from './base-search.model';

export abstract class BaseSearchService<T> {
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

  private applyFilters(qb: SelectQueryBuilder<T>, alias: string, filterFields?: Array<IFilterField<T>>): void {
    filterFields?.forEach((filter) => {
      if (!isNil(filter.value)) {
        const operation = filter.operation || QueryNarrowingOperators.EQ;
        const field = `${alias}.${String(filter.name)}`;
        const columnMetadata = this.repository.metadata.findColumnWithPropertyName(String(filter.name));
        const fieldType = columnMetadata?.type;

        if (
          fieldType === 'uuid' &&
          (operation === QueryNarrowingOperators.LIKE || operation === QueryNarrowingOperators.ILIKE)
        ) {
          throw new Error(`Cannot use ${operation} operator on uuid field ${field}`);
        }

        switch (operation) {
          case QueryNarrowingOperators.EQ:
            qb.andWhere(`${field} = :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.GT:
            qb.andWhere(`${field} > :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.GTE:
            qb.andWhere(`${field} >= :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.LT:
            qb.andWhere(`${field} < :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.LTE:
            qb.andWhere(`${field} <= :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.NE:
            qb.andWhere(`${field} != :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.IN:
            qb.andWhere(`${field} IN (:...${String(filter.name)})`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.NIN:
            qb.andWhere(`${field} NOT IN (:...${String(filter.name)})`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.LIKE:
            qb.andWhere(`${field} LIKE :${String(filter.name)}`, { [filter.name]: `%${filter.value}%` });
            break;
          case QueryNarrowingOperators.ILIKE:
            qb.andWhere(`${field} ILIKE :${String(filter.name)}`, { [filter.name]: `%${filter.value}%` });
            break;
          case QueryNarrowingOperators.CONTAINS:
            qb.andWhere(`${field} @> :${String(filter.name)}`, { [filter.name]: filter.value });
            break;
          case QueryNarrowingOperators.ISNULL:
            qb.andWhere(`${field} IS ${filter.value ? 'NOT NULL' : 'NULL'}`);
            break;
          default:
            qb.andWhere(`${field} = :${String(filter.name)}`, { [filter.name]: filter.value });
        }
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
      const direction = (sortDirections && BaseSearchService.getSortVerb(sortDirections[i])) || 'ASC';
      qb.addOrderBy(`${alias}.${String(column)}`, direction);
    });
  }

  public async search(
    options: IBaseEntitySearchDto<T>,
    config: ISearchConfig = {},
  ): Promise<{ items: T[]; total: number }> {
    const searchConfig: ISearchConfig = merge(BaseSearchService.defaultSearchConfig, config);
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
