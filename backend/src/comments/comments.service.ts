import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity'
import { Cards } from 'src/cards/entities/cards.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { User } from 'src/users/entity/users.entity';
import _ from 'lodash';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) 
    private readonly commentRepository:Repository<Comment>,
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly authService: AuthService
    ){}
  
  //댓글 생성
  async create(cardId: number, userId: number, commentDto: CommentDto) {
    await this.authService.validateCardToMember(cardId, userId);
    const { content } = commentDto;

  // 카드와 관련된 workers 및 users를 로드
  const card = await this.cardsRepository.createQueryBuilder('card')
    .leftJoinAndSelect('card.workers', 'worker')
    .leftJoinAndSelect('worker.user', 'user')
    .where('card.cardId = :cardId', { cardId })
    .getOne();

    //유저 이름 조회
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['name']
    })
    if (_.isNil(user)) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (!card) {
      throw new NotFoundException('해당 카드를 찾을 수 없습니다.')
    }

    //댓글 저장
    const comment = this.commentRepository.create({
      content,
      cardId,
      userId,
    });

    const savedComment = await this.commentRepository.save(comment)

   //알림 전송
   for(const worker of card.workers){
    this.notificationsGateway.sendNotification(worker.user.userId, `${user.name}님이 ${card.title} 카드에 댓글을 등록했습니다.`)
  }
   
    return savedComment;
  }

  //댓글 조회
  async findAll(cardId: number, userId: number) {
    await this.authService.validateCardToMember(cardId, userId);
    const comments = this.commentRepository.find({ where: { cardId, userId } });

    return comments;
  }

  //댓글 수정
  async update(commentId: number, userId: number, commentDto: CommentDto) {
    const { content } = commentDto;

    //댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({ where: { commentId } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    await this.authService.validateCardToMember(comment.cardId, userId);
    //본인만 수정 가능
    if (comment.userId !== userId) {
      throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    }

    //댓글 내용 변경
    comment.content = content;

    const savedComment = await this.commentRepository.save(comment);
    return savedComment;
  }

  //댓글 삭제
  async remove(commentId: number, userId: number) {
    //댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({ where: { commentId } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    await this.authService.validateCardToMember(comment.cardId, userId);
    //본인만 삭제 가능
    if (comment.userId !== userId) {
      throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
    }

    //댓글 삭제
    await this.commentRepository.delete(commentId);
    return { commentId };
  }
}
