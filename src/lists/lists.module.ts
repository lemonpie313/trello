import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lists])],
  controllers: [ListsController],
  providers: [ListsService]
})
export class ListsModule {}
