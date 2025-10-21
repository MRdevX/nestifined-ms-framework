import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { BookS2SService } from "./book.s2s.service";
import { BookService } from "./book.service";
import type { CreateBookDto, SearchBookDto, UpdateBookDto } from "./dto";

@Controller("books")
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookS2SService: BookS2SService,
  ) {}

  @Get("search")
  @Public()
  async search(@Query() query: SearchBookDto) {
    return this.bookService.searchBooks(query);
  }

  @Get()
  @Public()
  findAll() {
    return this.bookService.findAll();
  }

  @Get("with-author")
  @Public()
  findAllWithAuthor() {
    return this.bookService.findAllWithAuthor();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.bookService.findById(id);
  }

  @Get(":id/with-author")
  @Public()
  findOneWithAuthor(@Param("id") id: string) {
    return this.bookService.findByIdWithAuthor(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.bookService.deleteBook(id);
  }

  @Get("cache/:id")
  getCachedBook(@Param("id") id: string) {
    return this.bookService.getCachedBook(id);
  }

  @Post("cache")
  async cacheBook(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.createBook(createBookDto);
    await this.bookService.cacheBook(book);
    return book;
  }

  @Post("send")
  async sendBook(@Body() createBookDto: CreateBookDto) {
    await this.bookS2SService.sendBook(createBookDto);
  }
}
