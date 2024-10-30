import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IFilterField, QueryNarrowingOperators } from '@root/app/core/base/base-search.model';
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

  getFilterFields(): IFilterField<Book>[] {
    return [
      { name: 'title', value: this.title, operation: QueryNarrowingOperators.LIKE },
      { name: 'author', value: this.author, operation: QueryNarrowingOperators.EQ },
      { name: 'isbn', value: this.isbn, operation: QueryNarrowingOperators.EQ },
      { name: 'publishedDate', value: this.publishedDate, operation: QueryNarrowingOperators.GTE },
      { name: 'summary', value: this.summary, operation: QueryNarrowingOperators.LIKE },
    ];
  }

  getRelations(): string[] {
    return ['author'];
  }
}
