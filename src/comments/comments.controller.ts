import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

@ApiTags('댓글')
@Controller('cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성
   * @param cardId 
   * @param boardId 
   * @param listId 
   * @param commentDto 
   * @returns 
   */
  @Post()
  async create(@Param('cardId') cardId: number, @Query('boardId') boardId: number, @Query('listId') listId: number, @Body() commentDto: CommentDto) {
     const userId = 1
      const data = await this.commentsService.create( cardId, userId, commentDto);

      return {
        status: HttpStatus.CREATED,
        message: '댓글 생성에 성공했습니다.',
        data
      }
  }

  /**
   * 댓글 조회
   * @param cardId 
   * @param boardId 
   * @param listId 
   * @param commentDto 
   * @returns 
   */
  @Get()
  async findAll(@Param('cardId') cardId: number, @Query('boardId') boardId: number, @Query('listId') listId: number) {
    const data = await this.commentsService.findAll()
    
    return {
      status: HttpStatus.OK,
      message: '댓글 조회에 성공했습니다.',
      data
    }
  }

  /**
   * 댓글 수정
   * @param commentId 
   * @param commentDto 
   * @returns 
   */
  @Patch(':commentId')
  update(@Param('commentId') id: string, @Body() commentDto: CommentDto) {
    return this.commentsService.update(+id, commentDto);
  }

  /**
   * 댓글 삭제
   * @param commentId 
   * @returns 
   */
  @Delete(':commentId')
  remove(@Param('commentId') id: string) {
    return this.commentsService.remove(+id);
  }
}
