import { Injectable } from "@nestjs/common";
import { CacheService } from "../core/cache/cache.service";
import { MessagingService } from "../core/messaging/messaging.service";
import type { CreateBookDto } from "./dto";
import { Book } from "./entities/book.entity";

@Injectable()
export class BookS2SService {
  constructor(
    private cacheService: CacheService,
    private messagingService: MessagingService,
  ) {}

  async sendBook(createBookDto: CreateBookDto): Promise<void> {
    const client = this.messagingService.getClient();
    client.emit("book_created", createBookDto);
  }

  async receiveBook(data: CreateBookDto): Promise<Book> {
    const book = new Book();
    Object.assign(book, data);

    return book;
  }

  async cacheBook(book: Book): Promise<void> {
    const client = this.cacheService.getClient();
    await client.set(`book:${book.id}`, JSON.stringify(book));
  }

  async getCachedBook(id: string): Promise<Book | null> {
    const client = this.cacheService.getClient();
    const data = await client.get(`book:${id}`);
    return data ? JSON.parse(data) : null;
  }
}
