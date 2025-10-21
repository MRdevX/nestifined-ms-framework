import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { AuthorService } from "./author.service";
import type { CreateAuthorDto, UpdateAuthorDto } from "./dto";

@Controller("authors")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.authorService.findAll();
  }

  @Get("with-books")
  @Public()
  findAllWithBooks() {
    return this.authorService.findAllWithBooks();
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.authorService.findById(id);
  }

  @Get(":id/with-books")
  @Public()
  findOneWithBooks(@Param("id") id: string) {
    return this.authorService.findByIdWithBooks(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.authorService.delete(id);
  }
}
