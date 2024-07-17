import { Module } from '@nestjs/common';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklists } from './entities/checklists.entity';
import { Cards } from 'src/cards/entities/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checklists, Cards])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService],
})
export class ChecklistsModule {}
