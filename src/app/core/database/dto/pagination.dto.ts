import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export class FilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  ids?: string[];

  @IsOptional()
  @Type(() => Date)
  createdAfter?: Date;

  @IsOptional()
  @Type(() => Date)
  createdBefore?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAfter?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedBefore?: Date;
}

export class SearchDto extends PaginationDto {
  @IsOptional()
  @Type(() => FilterDto)
  filters?: FilterDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  relations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  select?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  withPagination?: boolean = false;
}
