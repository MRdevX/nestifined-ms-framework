import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchBookDto {
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
