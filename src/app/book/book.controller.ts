import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import type { BookS2SService } from './book.s2s.service';
import type { BookService } from './book.service';
import type { CreateBookDto, SearchBookDto, UpdateBookDto } from './dto';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookS2SService: BookS2SService,
  ) {}

  @Get('search')
  async search(@Query() query: SearchBookDto) {
    return this.bookService.searchBooks(query);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('with-author')
  findAllWithAuthor() {
    return this.bookService.findAllWithAuthor();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Get(':id/with-author')
  findOneWithAuthor(@Param('id') id: string) {
    return this.bookService.findByIdWithAuthor(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }

  @Get('cache/:id')
  getCachedBook(@Param('id') id: string) {
    return this.bookService.getCachedBook(id);
  }

  @Post('cache')
  async cacheBook(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.createBook(createBookDto);
    await this.bookService.cacheBook(book);
    return book;
  }

  @Post('send')
  async sendBook(@Body() createBookDto: CreateBookDto) {
    await this.bookS2SService.sendBook(createBookDto);
  }
}
