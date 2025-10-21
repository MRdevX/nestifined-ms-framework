import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AuthorModule } from "./author/author.module";
import { BookModule } from "./book/book.module";
import { CoreModule } from "./core/core.module";
import { UsersModule } from "./users/users.module";

const modules = [AuthModule, UsersModule, BookModule, AuthorModule];

@Module({
  imports: [CoreModule, ...modules],
})
export class AppModule {}
