import { forwardRef, Inject } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorService } from "../author/author.service";
import { Author } from "../author/entities/author.graphql";
import { BookService } from "./book.service";
import { CreateBookInput } from "./dto/create-book.input";
import { SearchBookInput } from "./dto/search-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { Book } from "./entities/book.graphql";

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,
  ) {}

  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Query(() => [Book])
  async booksWithAuthor(): Promise<Book[]> {
    return this.bookService.findAllWithAuthor();
  }

  @Query(() => [Book])
  async searchBooks(@Args("input") searchInput: SearchBookInput): Promise<Book[]> {
    return this.bookService.searchBooks(searchInput);
  }

  @Query(() => Book, { nullable: true })
  async book(@Args("id") id: string): Promise<Book | null> {
    return this.bookService.findById(id);
  }

  @Query(() => Book, { nullable: true })
  async bookWithAuthor(@Args("id") id: string): Promise<Book | null> {
    return this.bookService.findByIdWithAuthor(id);
  }

  @Mutation(() => Book)
  async createBook(@Args("input") createBookInput: CreateBookInput): Promise<Book> {
    return this.bookService.createBook(createBookInput);
  }

  @Mutation(() => Book)
  async updateBook(@Args("id") id: string, @Args("input") updateBookInput: UpdateBookInput): Promise<Book> {
    return this.bookService.updateBook(id, updateBookInput);
  }

  @Mutation(() => Boolean)
  async deleteBook(@Args("id") id: string): Promise<boolean> {
    await this.bookService.deleteBook(id);
    return true;
  }

  @ResolveField(() => Author, { nullable: true })
  async author(@Parent() book: Book): Promise<Author | null> {
    if (book.author) {
      return book.author;
    }
    return this.authorService.findById(book.author?.id || "");
  }
}
