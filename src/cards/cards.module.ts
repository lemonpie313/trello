import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { Workers } from './entities/workers.entity';
import { Members } from 'src/boards/entities/member.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cards, Workers, Members, Comment])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
