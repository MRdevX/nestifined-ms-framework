import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { AuthorModule } from "./author/author.module";
import { BookModule } from "./book/book.module";
import { CoreModule } from "./core/core.module";
import { HealthController } from "./health/health.controller";
import { UsersModule } from "./users/users.module";

const modules = [AuthModule, UsersModule, BookModule, AuthorModule];

@Module({
  imports: [CoreModule, ...modules],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
