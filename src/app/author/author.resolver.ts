import { forwardRef, Inject } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { BookService } from "../book/book.service";
import { Book } from "../book/entities/book.graphql";
import { AuthorService } from "./author.service";
import { CreateAuthorInput } from "./dto/create-author.input";
import { UpdateAuthorInput } from "./dto/update-author.input";
import { Author } from "./entities/author.graphql";

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    private readonly authorService: AuthorService,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}

  @Query(() => [Author])
  async authors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Query(() => Author, { nullable: true })
  async author(@Args("id") id: string): Promise<Author | null> {
    return this.authorService.findById(id);
  }

  @Mutation(() => Author)
  async createAuthor(@Args("input") createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorService.createAuthor(createAuthorInput);
  }

  @Mutation(() => Author)
  async updateAuthor(@Args("id") id: string, @Args("input") updateAuthorInput: UpdateAuthorInput): Promise<Author> {
    return this.authorService.updateAuthor(id, updateAuthorInput);
  }

  @Mutation(() => Boolean)
  async deleteAuthor(@Args("id") id: string): Promise<boolean> {
    await this.authorService.deleteAuthor(id);
    return true;
  }

  @ResolveField(() => [Book])
  async books(@Parent() author: Author): Promise<Book[]> {
    if (author.books) {
      return author.books;
    }
    return this.bookService.findByAuthorId(author.id);
  }
}
