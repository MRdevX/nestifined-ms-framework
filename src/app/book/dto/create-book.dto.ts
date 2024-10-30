import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsUUID()
  authorId: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @IsString()
  isbn: string;

  @IsString()
  summary: string;
}
