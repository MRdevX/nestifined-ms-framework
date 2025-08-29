import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthorModule } from "./author/author.module";
import { BookModule } from "./book/book.module";
import { graphqlConfig } from "./config";
import { CoreModule } from "./core/core.module";

const modules = [BookModule, AuthorModule];

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig,
    }),
    ...modules,
  ],
})
export class AppModule {}
