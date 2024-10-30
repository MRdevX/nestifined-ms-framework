import { IsOptional, IsString, IsInt, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export interface IBaseEntitySearchDto<T> {
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

export class BaseEntitySearchDto<T> implements IBaseEntitySearchDto<T> {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];

  @IsOptional()
  @IsArray()
  filterFields?: Array<{ name: keyof T; value: any }>;

  @IsOptional()
  @IsString()
  searchInput?: string;

  @IsOptional()
  @IsArray()
  searchFields?: Array<keyof T>;

  @IsOptional()
  @IsArray()
  selectFields?: Array<keyof T>;

  @IsOptional()
  @IsArray()
  sortFields?: Array<keyof T>;

  @IsOptional()
  @IsArray()
  @IsEnum(['ASC', 'DESC'], { each: true })
  sortDirections?: Array<'ASC' | 'DESC'>;
}
