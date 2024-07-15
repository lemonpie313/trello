import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { BOARD_ROLE } from './types/board-roles.type';
import { Member } from './entities/member.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly boardReporitory: Repository<Board>,
    @InjectRepository(Member) private readonly memberReporitory: Repository<Member>,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: number) {
    const board = await this.boardReporitory.save({
      ...createBoardDto,
      members: [
        {
          userId,
          role: BOARD_ROLE.OWNER,
        },
      ],
    });

    // 생성 후 알림 전송
    this.notificationsGateway.sendNotification(userId, '새 보드가 생성되었습니다.')

    return board;
  }

  async findAll(title: string) {
    let condition = {};
    if (title) {
      condition = { title: Like(`${title}%`) };
    }
    const boards = await this.boardReporitory.find({
      where: {
        ...condition,
      },
    });
    if (!boards) {
      throw new NotFoundException('등록된 보드가 없습니다.');
    }
    return boards;
  }

  async findOne(boardId: number) {
    const board = await this.boardReporitory.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    // 릴레이션 추가 예정
    return board;
  }

  async update(updateBoardDto: UpdateBoardDto, boardId: number) {
    const { title, background, description } = updateBoardDto;
    const board = await this.boardReporitory.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('보드 정보를 찾을 수 없습니다.');
    }
    const boardUpdate = await this.boardReporitory.update(
      { boardId },
      {
        ...(title && { title }),
        ...(background && { background }),
        ...(description && { description }),
      }
    );
    return boardUpdate;
  }

  async delete(boardId: number) {
    const board = await this.boardReporitory.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('보드 정보를 찾을 수 없습니다.');
    }
    const boardDelete = await this.boardReporitory.delete({ boardId });
    return boardDelete;
  }

  async invite(boardId: number, userId: number) {
    const member = await this.memberReporitory.findOne({ where: { userId } });
    if (member) {
      throw new BadRequestException('이미 등록된 멤버입니다.');
    }
    const invite = await this.memberReporitory.save({ boardId, userId });
    return invite;
  }
}
