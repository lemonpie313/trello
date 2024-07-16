import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { LexoService } from './lexo.service';

@Controller('lexo')
export class LexoController {
  constructor(private readonly lexoService: LexoService) {}

  @Get('items')
  getItems() {
    return this.lexoService.find();
  }

  @Post('items')
  addItem(@Body('data') data: string) {
    if (!data) {
      throw new BadRequestException('데이터가 필요합니다.');
    }
    this.lexoService.insert(data);
    return this.lexoService.find();
  }

  @Post('items/move')
  moveItem(@Body('itemId') itemId: number, @Body('whereId') whereId: number) {
    if (
      isNaN(itemId) ||
      isNaN(whereId) ||
      whereId < 0 ||
      whereId >= this.lexoService.items.length
    ) {
      throw new BadRequestException('유효하지 않은 데이터 또는 인덱스 값입니다.');
    }

    this.lexoService.move(itemId, whereId);
    return this.lexoService.find();
  }
}
