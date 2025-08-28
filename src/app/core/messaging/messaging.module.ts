import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import s2sConfig from '../../config/s2s.config';
import { MessagingService } from './messaging.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(s2sConfig)],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
