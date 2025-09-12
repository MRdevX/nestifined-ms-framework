import { Module } from "@nestjs/common";
import { AuthorModule } from "./author/author.module";
import { BookModule } from "./book/book.module";
import { CoreModule } from "./core/core.module";

const modules = [BookModule, AuthorModule];

@Module({
  imports: [CoreModule, ...modules],
})
export class AppModule {}
