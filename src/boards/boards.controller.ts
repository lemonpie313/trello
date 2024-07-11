import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BoardsService } from './boards.service';

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
      message: '공연 생성에 성공했습니다.',
      data,
    };
  }

  @Get()
  async findAll() {}

  @Get(':id')
  async findOne(@Param('id') id: number) {}

  @Patch(':id')
  async update(@Param('id') id: number) {}

  @Delete(':id')
  async delete(@Param('id') id: number) {}

  @Post(':id')
  async invite(@Param('id') id: number) {}
}
