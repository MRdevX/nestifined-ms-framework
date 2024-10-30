export enum QueryNarrowingOperators {
  EQ = 'EQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  NE = 'NE',
  IN = 'IN',
  NIN = 'NIN',
  LIKE = 'LIKE',
  ILIKE = 'ILIKE',
  CONTAINS = 'CONTAINS',
  ISNULL = 'ISNULL',
}

export interface ISearchConfig {
  caseInsensitiveSearch?: boolean;
  fullTextSearch?: boolean;
  withDeleted?: boolean;
  andWhere?: { condition: string; parameters?: any };
}

export interface IFilterField<T> {
  name: keyof T;
  value: any;
  operation?: QueryNarrowingOperators;
}

export interface IBaseEntitySearchDto<T> {
  limit?: number;
  offset?: number;
  relations?: string[];
  filterFields?: Array<IFilterField<T>>;
  searchInput?: string;
  searchFields?: Array<keyof T>;
  selectFields?: Array<keyof T>;
  sortFields?: Array<keyof T>;
  sortDirections?: Array<'ASC' | 'DESC'>;
}
