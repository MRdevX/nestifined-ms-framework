import { Controller, Get, Query } from "@nestjs/common";
import { BaseService } from "../base/base.service";
import { SearchDto } from "../dto/pagination.dto";

@Controller("example-search")
export class SearchExampleController<T> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Get("paginated")
  async getPaginated(@Query() searchDto: SearchDto) {
    return this.baseService.search({
      pagination: {
        page: searchDto.page,
        limit: searchDto.limit,
        sortBy: searchDto.sortBy,
        sortOrder: searchDto.sortOrder,
      },
      filters: searchDto.filters,
      relations: searchDto.relations,
      select: searchDto.select,
      withPagination: true,
    });
  }

  @Get("all")
  async getAll(@Query() searchDto: SearchDto) {
    return this.baseService.search({
      filters: searchDto.filters,
      relations: searchDto.relations,
      select: searchDto.select,
      withPagination: false,
    });
  }

  @Get("with-relations")
  async getWithRelations(@Query() searchDto: SearchDto) {
    return this.baseService.searchWithRelations(searchDto.relations || [], searchDto.filters, searchDto.select);
  }

  @Get("with-filters")
  async getWithFilters(@Query() searchDto: SearchDto) {
    return this.baseService.searchWithFilters(searchDto.filters || {}, searchDto.relations, searchDto.select);
  }

  @Get("count")
  async getCount(@Query() searchDto: SearchDto) {
    return this.baseService.count(searchDto.filters);
  }
}
