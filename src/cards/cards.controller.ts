import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { CardsService } from './cards.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCardsByListIdDto } from './dtos/get-cards-by-list-id.dto';
import { UpdateCardDto } from './dtos/update-card.dto';

@ApiTags('CARD API')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  /**
   * 카드 생성
   * @returns
   */
  @Post('/') // 인증으로 userId 받아서 멤버인지 검증 필요
  async createCard(@Body() createCardDto: CreateCardDto) {
    // listId 쿼리 추가
    // param에 listId, req.user에 user 추가할것
    const card = await this.cardsService.createCard(createCardDto); // listId, userId 추가할것
    return {
      status: HttpStatus.CREATED,
      message: '카드 생성이 완료되었습니다.',
      data: card,
    };
  }

  /**
   * 카드 조회
   * @returns
   */
  @Get('/') // 인증으로 userId 받아서 멤버인지 검증 필요
  async readAllCards(@Query() getCardsByListDto: GetCardsByListIdDto) {
    const { listId } = getCardsByListDto;
    const cards = await this.cardsService.readAllCards(listId);
    return {
      status: HttpStatus.OK,
      message: '카드 조회에 성공했습니다.',
      data: cards,
    };
  }
  /**
   * 카드 상세 조회
   * @returns
   */
  @Get('/:cardId') // 인증으로 userId 받아서 멤버인지 검증 필요
  async readCard(@Param('cardId') cardId: number) {
    const card = await this.cardsService.readCard(cardId);
    return {
      status: HttpStatus.OK,
      message: '카드 상세조회에 성공했습니다.',
      data: card,
    };
  }

  /**
   * 카드 수정
   * @returns
   */
  @Patch('/:cardId') // 인증으로 userId도 받아서 작성자만 수정권한 줘야함..
  async updateCard(@Param('cardId') cardId: number, @Body() updateCardDto: UpdateCardDto) {
    const card = await this.cardsService.updateCard(cardId, updateCardDto);
    return {
      status: HttpStatus.OK,
      message: '카드 수정이 완료되었습니다.',
      data: card,
    };
  }

  /**
   * 카드 삭제
   * @returns
   */
  @Delete('/:cardId') // 인증으로 userId도 받아서 작성자만 수정권한 줘야함..
  async deleteCard(@Param('cardId') cardId: number) {
    const card = await this.cardsService.deleteCard(cardId);
    return {
      status: HttpStatus.OK,
      message: '카드 삭제가 완료되었습니다.',
      data: {
        cardId,
      },
    };
  }
}
