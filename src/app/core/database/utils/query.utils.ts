import { FilterDto } from "../dto/pagination.dto";
import { FilterOptions, PaginationOptions, SearchOptions } from "../interfaces/database.interface";

export function buildSearchOptions(
  pagination?: Partial<PaginationOptions>,
  filters?: FilterDto,
  relations?: string[],
  select?: string[],
  withPagination: boolean = false,
): SearchOptions {
  return {
    pagination: {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      sortBy: pagination?.sortBy || "createdAt",
      sortOrder: pagination?.sortOrder || "DESC",
    },
    filters: buildFilters(filters),
    relations: relations || [],
    select: select || [],
    withPagination,
  };
}

export function buildFilters(filterDto?: FilterDto): FilterOptions {
  if (!filterDto) return {};

  const filters: FilterOptions = {};

  if (filterDto.search) {
    filters.search = filterDto.search;
  }

  if (filterDto.ids && filterDto.ids.length > 0) {
    filters.id = filterDto.ids;
  }

  if (filterDto.createdAfter) {
    filters.createdAt = `>=${filterDto.createdAfter.toISOString()}`;
  }

  if (filterDto.createdBefore) {
    filters.createdAt = `<=${filterDto.createdBefore.toISOString()}`;
  }

  if (filterDto.updatedAfter) {
    filters.updatedAt = `>=${filterDto.updatedAfter.toISOString()}`;
  }

  if (filterDto.updatedBefore) {
    filters.updatedAt = `<=${filterDto.updatedBefore.toISOString()}`;
  }

  return filters;
}

export function parseDateFilter(value: string): { operator: string; date: Date } | null {
  if (typeof value !== "string" || (!value.startsWith(">=") && !value.startsWith("<="))) {
    return null;
  }

  const operator = value.substring(0, 2);
  const dateString = value.substring(2);
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return { operator, date };
}

export function buildSearchQuery(searchTerm: string, searchableFields: string[]): string {
  return searchableFields.map((field) => `${field} ILIKE '%${searchTerm}%'`).join(" OR ");
}
