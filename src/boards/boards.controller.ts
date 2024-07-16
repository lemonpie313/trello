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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BoardsService } from './boards.service';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { BOARD_ROLE } from './types/board-roles.type';

@ApiTags('Board API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  /**
   * 보드 생성
   * @param createBoardDto
   * @returns
   */

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    console.log('req.user:', req.user)
    const userId = req.user.userId;
    if(!userId){
      throw new Error('userId is undefined or null');
    }
    const data = await this.boardService.create(createBoardDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 목록 조회
   * @returns
   */
  @Get()
  @ApiQuery({ name: 'title', required: false })
  async findAll(@Query('title') title?: string) {
    const data = await this.boardService.findAll(title);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 목록 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 상세 조회
   * @param id
   * @returns
   */
  @ApiParam({ name: 'id', description: '보드 ID' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.boardService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 상세 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 수정
   * @param id
   * @param updateBoardDto
   * @returns
   */
  @ApiParam({ name: 'id', description: '보드 ID' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto) {
    const data = await this.boardService.update(updateBoardDto, id);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 삭제
   * @param id
   * @returns
   */
  @ApiParam({ name: 'id', description: '보드 ID' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.boardService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 삭제에 성공했습니다.',
      data,
    };
  }

  /**
   * 멤버 초대
   * @param userId
   * @returns
   */
  @ApiParam({ name: 'boardId', description: '보드 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1, description: '사용자 ID' },
      },
    },
    description: '사용자 ID',
  })
  @Post(':boardId/members')
  async invite(@Param('boardId') boardId: number, @Body('userId') userId: number) {
    const data = await this.boardService.invite(boardId, userId);

    return {
      statusCode: HttpStatus.OK,
      message: '멤버 초대에 성공했습니다.',
      data,
    };
  }
}
