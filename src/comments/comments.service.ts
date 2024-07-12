import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) 
    private readonly commentRepository:Repository<Comment>
    ){}
  
  //댓글 생성
  async create(cardId: number, userId:number, commentDto: CommentDto) {
    const {content} = commentDto;

    const comment = this.commentRepository.create({
      content,
      cardId,
      userId
    })

    const savedComment = this.commentRepository.save(comment)

    return savedComment;
  }

  //댓글 조회
  async findAll(cardId: number) {
    const comments = this.commentRepository.find({where: {cardId}})

    return comments
  }


  //댓글 수정
  async update(commentId: number, userId: number, commentDto: CommentDto) {
    const {content} = commentDto;

    //댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({where:{commentId}})
    if(!comment){
      throw new NotFoundException('댓글을 찾을 수 없습니다.')
    }

    //본인만 수정 가능
    if (comment.userId !== userId) {
      throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    }

    //댓글 내용 변경
    comment.content = content;

    const savedComment = await this.commentRepository.save(comment)
    return savedComment
  }

  async remove(commentId: number, userId: number) {
    //댓글 존재 여부 확인
     const comment = await this.commentRepository.findOne({where:{commentId}})
        if(!comment){
          throw new NotFoundException('댓글을 찾을 수 없습니다.')
        }

    //본인만 삭제 가능
    if (comment.userId !== userId) {
      throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
    }

    const deletedComment = await this.commentRepository.delete(comment)
    return deletedComment
  }
}
