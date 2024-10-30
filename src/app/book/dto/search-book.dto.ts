import { IsString, IsOptional } from 'class-validator';

export class SearchBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
