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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { CardsService } from './cards.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateCardDto } from './dtos/update-card.dto';
import { CreateCardDeadlineDto } from './dtos/create-card-deadline.dto';
import { CreateWorkerDto } from './dtos/create-worker.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('CARD API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  /**
   * 카드 생성
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'listId', description: '리스트 ID', required: false })
  @Post('/')
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @Query('listId') listId: number,
    @Request() req
  ) {
    console.log('req.user:', req.user);
    const userId = req.user.userId;
    if(!userId){
      throw new Error('userId is undefined or null');
    }
    const card = await this.cardsService.createCard(userId, listId, createCardDto); // listId, userId 추가할것
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
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'listId', description: '리스트 ID', required: false })
  @Get('/')
  async readAllCards(@Query('listId') listId: number, @Request() req) {
    const userId = req.user.id;
    const cards = await this.cardsService.readAllCards(userId, listId);
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
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Get('/:cardId')
  async readCard(@Param('cardId') cardId: number, @Request() req) {
    const userId = req.user.id;
    const card = await this.cardsService.readCard(userId, cardId);
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
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Patch('/:cardId')
  async updateCard(
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const card = await this.cardsService.updateCard(userId, cardId, updateCardDto);
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
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Delete('/:cardId')
  async deleteCard(@Param('cardId') cardId: number, @Request() req) {
    const userId = req.user.id;
    const card = await this.cardsService.deleteCard(userId, cardId);
    return {
      status: HttpStatus.OK,
      message: '카드 삭제가 완료되었습니다.',
      data: {
        cardId,
      },
    };
  }

  /**
   * 카드 마감일 지정
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Patch('/:cardId/deadline')
  async updateDeadline(
    @Param('cardId') cardId: number,
    @Body() createCardDeadlineDto: CreateCardDeadlineDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const card = await this.cardsService.updateDeadline(userId, cardId, createCardDeadlineDto);
    return {
      status: HttpStatus.OK,
      message: '카드 마감날짜 지정이 완료되었습니다.',
      data: {
        card,
      },
    };
  }

  /**
   * 할당자 지정
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Post('/:cardId/workers')
  async createWorkers(
    @Param('cardId') cardId: number,
    @Body() createWorkerDto: CreateWorkerDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const card = await this.cardsService.createWorkers(userId, cardId, createWorkerDto);
    return {
      status: HttpStatus.CREATED,
      message: '카드 할당자 지정이 완료되었습니다.',
      data: {
        card,
      },
    };
  }

  /**
   * 카드 순서 수정
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'cardId', description: '카드 ID', required: true })
  @Patch('/:cardId/order')
  async updateOrder(
    @Param('cardId') cardId: number,
    @Query() updateOrderDto: UpdateOrderDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const cards = await this.cardsService.updateOrder(userId, cardId, updateOrderDto);
    return {
      status: HttpStatus.OK,
      message: '카드 순서 수정이 완료되었습니다.',
      data: {
        cards,
      },
    };
  }
}
