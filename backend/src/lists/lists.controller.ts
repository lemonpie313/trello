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
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dtos/create-list.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('LIST API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  /**
   * 리스트 생성
   * @returns
   */
  @Post('')
  @ApiQuery({ name: 'board_id', type: Number, description: '보드 ID' })
  async createlist(
    @Request() req,
    @Query('board_id') boardId: number,
    @Body() createListDto: CreateListDto
  ) {
    const userId = req.user.userId;
    const data = await this.listsService.createlist(boardId, createListDto, userId);

    return {
      status: HttpStatus.CREATED,
      message: '리스트 생성이 완료되었습니다.',
      data,
    };
  }

  /**
   * 특정 보드에 리스트 조회
   * @returns
   */
  @Get('/')
  @ApiQuery({ name: 'board_id', type: Number, description: '보드 ID' })
  async findAllList(@Request() req, @Query('board_id') boardId: number) {
    const userId = req.user.userId;
    const data = await this.listsService.findAllList(boardId, userId);

    return {
      status: HttpStatus.OK,
      message: '리스트 조회가 완료되었습니다.',
      data,
    };
  }

  /**
   * 리스트 수정
   * @returns
   */
  @Patch(':listId')
  @ApiParam({ name: 'listId', type: Number, description: '리스트 ID' })
  async updateList(
    @Request() req,
    @Param('listId') listId: number,
    @Body() createListDto: CreateListDto
  ) {
    const userId = req.user.userId;
    const data = await this.listsService.updateList(listId, createListDto, userId);

    return {
      status: HttpStatus.CREATED,
      message: '리스트 변경이 완료되었습니다.',
      data,
    };
  }

  /**
   * 리스트 삭제
   * @returns
   */
  @Delete(':listId')
  @ApiParam({ name: 'listId', type: Number, description: '리스트 ID' })
  async deleteList(@Request() req, @Param('listId') listId: number) {
    const userId = req.user.userId;
    const data = await this.listsService.deleteList(listId, userId);
    if (data) {
      return {
        status: HttpStatus.CREATED,
        message: '리스트 삭제가 완료되었습니다.',
      };
    }
  }

  /**
   * 리스트 이동
   * @returns
   */
  @Patch(':listId/order')
  @ApiQuery({ name: 'boardId', type: Number, description: '보드 ID' })
  @ApiQuery({ name: 'movedListId', type: Number, description: '기준' })
  async moveList(
    @Request() req,
    @Param('listId') listId: number,
    @Query('boardId') boardId: number,
    @Query('movedListId') movedListId: number
  ) {
    const userId = req.user.userId;
    const movedata = await this.listsService.moveList(listId, boardId, movedListId, userId);

    return {
      status: HttpStatus.CREATED,
      message: '리스트 이동이 완료되었습니다.',
      data: movedata,
    };
  }
}