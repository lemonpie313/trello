import { Module, forwardRef } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Members } from './entities/member.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from 'src/users/entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Members, User]), AuthModule, NotificationsModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
