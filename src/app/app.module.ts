import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { BookModule } from './book/book.module';

const modules = [BookModule];

@Module({
  imports: [CoreModule, ...modules],
})
export class AppModule {}
