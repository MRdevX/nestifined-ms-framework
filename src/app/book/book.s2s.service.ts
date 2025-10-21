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
    if (client) {
      client.emit("book_created", createBookDto);
    } else {
      console.warn("Messaging client not available - book not sent to queue");
    }
  }

  async receiveBook(data: CreateBookDto): Promise<Book> {
    const book = new Book();
    Object.assign(book, data);

    return book;
  }

  async cacheBook(book: Book): Promise<void> {
    const client = this.cacheService.getClient();
    if (client) {
      await client.set(`book:${book.id}`, JSON.stringify(book));
    } else {
      console.warn("Cache client not available - book not cached");
    }
  }

  async getCachedBook(id: string): Promise<Book | null> {
    const client = this.cacheService.getClient();
    if (client) {
      const data = await client.get(`book:${id}`);
      return data ? JSON.parse(data) : null;
    } else {
      console.warn("Cache client not available - returning null");
      return null;
    }
  }
}
