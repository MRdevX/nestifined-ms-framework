import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';

const modules = [BookModule, AuthorModule];

@Module({
  imports: [CoreModule, ...modules],
})
export class AppModule {}
