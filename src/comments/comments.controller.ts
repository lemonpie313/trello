import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Comment API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성
   * @param cardId
   * @param commentDto
   * @returns
   */
  @Post()
  async create(@Req() req, @Param('cardId') cardId: number, @Body() commentDto: CommentDto) {
    const userId = req.user.id;
    const data = await this.commentsService.create(cardId, userId, commentDto);

    return {
      status: HttpStatus.CREATED,
      message: '댓글 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 조회
   * @param cardId
   * @returns
   */
  @Get()
  async findAll(@Req() req, @Param('cardId') cardId: number) {
    const userId = req.user.id;
    const data = await this.commentsService.findAll(cardId, userId);

    return {
      status: HttpStatus.OK,
      message: '댓글 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 수정
   * @param commentDto
   * @param commentId
   * @returns
   */
  @Patch(':commentId')
  async update(@Req() req, @Param('commentId') commentId: number, @Body() commentDto: CommentDto) {
    const userId = req.user.id;
    const data = await this.commentsService.update(commentId, userId, commentDto);

    return {
      status: HttpStatus.OK,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 삭제
   * @param commentId
   * @param commentDto
   * @returns
   */
  @Delete(':commentId')
  async remove(@Req() req, @Param('commentId') commentId: number) {
    const userId = req.user.id;
    const data = await this.commentsService.remove(commentId, userId);

    return {
      status: HttpStatus.OK,
      message: '댓글 삭제에 성공했습니다.',
      data,
    };
  }
}
