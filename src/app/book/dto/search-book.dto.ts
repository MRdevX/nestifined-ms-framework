import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntitySearchDto } from '@root/app/core/base/base-entity-search.dto';
import { Book } from '../entities/book.entity';

export class SearchBookDto extends BaseEntitySearchDto<Book> {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedDate?: Date;

  @IsOptional()
  @IsString()
  summary?: string;
}
