import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { CardsService } from './cards.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCardsByListIdDto } from './dtos/get-cards-by-list-id.dto';

@ApiTags('CARD API')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  /**
   * 카드 생성
   * @returns
   */
  @Post('/')
  async createCard(@Body() createCardDto: CreateCardDto) {
    // listId 쿼리 추가
    // param에 listId, req.user에 user 추가할것
    const card = await this.cardsService.createCard(createCardDto); // listId, userId 추가할것
    return {
      status: HttpStatus.CREATED,
      message: '카드 생성이 완료되었습니다.',
      data: '생성',
    };
  }

  /**
   * 카드 조회
   * @returns
   */
  @Get('/')
  async readAllCards(@Query() getCardsByListDto: GetCardsByListIdDto) {
    const { listId } = getCardsByListDto;
    const cards = await this.cardsService.readAllCards(listId);
    return {
      status: HttpStatus.OK,
      message: '카드 조회에 성공했습니다.',
      data: cards,
    };
  }
}
