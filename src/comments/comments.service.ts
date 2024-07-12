import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: CommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
