import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { Workers } from './entities/workers.entity';
import { Members } from 'src/boards/entities/member.entity';
import { Comment } from 'src/comments/entities/comment.entity';
<<<<<<< HEAD
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from 'src/users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cards, Workers, Members, Comment, User]),
  NotificationsModule],

=======
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cards, Workers, Members, Comment]), AuthModule],
>>>>>>> e7de056d0d66f2f82edd8e1cc3f6238945ad457e
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
