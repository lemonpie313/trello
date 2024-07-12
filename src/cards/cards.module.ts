import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { Workers } from './entities/workers.entity';
import { LexoRank } from 'lexorank';

@Module({
  imports: [TypeOrmModule.forFeature([Cards, Workers])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
