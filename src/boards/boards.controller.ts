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
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { UpdateBoardDto } from './dtos/update-board.dto';

@ApiTags('보드')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  /**
   * 보드 생성
   * @param createBoardDto
   * @returns
   */
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    const data = await this.boardService.create(createBoardDto);
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
   * @param createBoardDto
   * @returns
   */
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
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.boardService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 삭제에 성공했습니다.',
      data,
    };
  }

  //멤버 테이블 추가되면 작성하겠습니다.

  /**
   * 멤버 초대
   * @param id
   * @returns
   */
  @Post(':id/members')
  async invite(@Param('id') id: number, @Body() userId: number) {
    const data = await this.boardService.invite(id, userId);
  }
}
