import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingService } from './messaging.service';
import s2sConfig from '../../config/s2s.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(s2sConfig)],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
