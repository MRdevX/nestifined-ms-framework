import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CreateBookDto } from './dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookS2SService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('S2S_RABBITMQ_URL')],
        queue: this.configService.get<string>('S2S_RABBITMQ_QUEUE'),
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendBook(createBookDto: CreateBookDto): Promise<void> {
    this.client.emit('book_created', createBookDto);
  }

  async receiveBook(data: any): Promise<Book> {
    // Process received book data
    const book: Book = data;
    // Save or process the book as needed
    return book;
  }
}
