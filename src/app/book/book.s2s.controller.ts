import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { BookS2SService } from './book.s2s.service';
import { CreateBookDto } from './dto';

@Controller()
export class BookS2SController {
  constructor(private readonly bookS2SService: BookS2SService) {}

  @MessagePattern('book_created')
  async handleBookCreated(@Payload() data: CreateBookDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.bookS2SService.receiveBook(data);
    channel.ack(originalMsg);
  }
}
