import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagingService } from "./messaging.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
