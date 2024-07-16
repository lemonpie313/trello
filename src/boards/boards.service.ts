import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { BOARD_ROLE } from './types/board-roles.type';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Members } from './entities/member.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly boardReporitory: Repository<Board>,
    @InjectRepository(Members) private readonly memberReporitory: Repository<Members>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly authService: AuthService
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

  async findAll(title: string, userId: number) {
    let condition = {};
    if (title) {
      condition = { title: Like(`${title}%`) };
    }
    const boards = await this.memberReporitory.find({
      where: { userId, board: { ...condition } },
      relations: ['board'],
    });
    if (!boards) {
      throw new NotFoundException('등록된 보드가 없습니다.');
    }
    const result = boards.map((data) => {
      return { board: data.board };
    });
    return result;
  }

  async findOne(boardId: number) {
    const board = await this.boardReporitory.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    return board;
  }

  async findOneBoard(boardId: number, userId: number) {
    await this.authService.validateMember(boardId, userId);
    const board = this.findOne(boardId);
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    return board;
  }

  async update(updateBoardDto: UpdateBoardDto, boardId: number, userId: number) {
    const { title, background, description } = updateBoardDto;

    await this.authService.validateOwner(boardId, userId);
    const board = await this.findOne(boardId);
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
    return this.findOne(boardId);
  }

  async delete(boardId: number, userId: number) {
    await this.authService.validateOwner(boardId, userId);
    const board = await this.boardReporitory.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('보드 정보를 찾을 수 없습니다.');
    }
    await this.boardReporitory.delete({ boardId });
    return boardId;
  }

  async invite(boardId: number, InviteUserId: number, userId: number) {
    await this.authService.validateOwner(boardId, userId);
    const member = await this.memberReporitory.findOne({
      where: { userId: InviteUserId, boardId },
    });
    if (member) {
      throw new BadRequestException('이미 등록된 멤버입니다.');
    }
    const invite = await this.memberReporitory.save({ boardId, userId: InviteUserId });
    return invite;
  }
}
