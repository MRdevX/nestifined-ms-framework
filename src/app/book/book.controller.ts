import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto, SearchBookDto } from './dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('search')
  findByQuery(@Query() query: SearchBookDto) {
    return this.bookService.findByQuery(query);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
