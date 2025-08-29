import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './author.controller';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { AuthorRepository } from './repositories/author.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorRepository, AuthorService, AuthorResolver],
  exports: [AuthorService],
})
export class AuthorModule {}
