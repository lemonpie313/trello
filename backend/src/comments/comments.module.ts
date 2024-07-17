import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from 'src/cards/entities/cards.entity';
import { User } from 'src/users/entity/users.entity';
import { Comment } from './entities/comment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Cards])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
