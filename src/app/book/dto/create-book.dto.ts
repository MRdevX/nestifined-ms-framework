import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @IsString()
  isbn: string;

  @IsString()
  summary: string;
}
