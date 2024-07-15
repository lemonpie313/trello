import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Members } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Members])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
