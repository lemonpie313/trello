import { Module } from '@nestjs/common';
import { LexoController } from './lexo.controller';
import { LexoService } from './lexo.service';

@Module({
  imports: [],
  controllers: [LexoController],
  providers: [LexoService],
})
export class LexoModule {}
