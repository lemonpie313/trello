import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(Board) private readonly showReporitory: Repository<Board>) {}

  async create(createBoardDto: CreateBoardDto) {
    const board = await this.showReporitory.save({
      ...createBoardDto,
    });
    return board;
  }

  async findAll(title: string) {
    let condition = {};
    if (title) {
      condition = { title: Like(`${title}%`) };
    }
    const boards = await this.showReporitory.find({
      where: {
        ...condition,
      },
    });
    if (!boards) {
      throw new NotFoundException('등록된 보드가 없습니다.');
    }
    return boards;
  }

  async findOne(id: number) {
    const board = await this.showReporitory.findOne({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    // 릴레이션 추가 예정
    return board;
  }

  async update(updateBoardDto: UpdateBoardDto, id: number) {
    const { title, background, description } = updateBoardDto;
    const board = await this.showReporitory.findOne({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException('보드 정보를 찾을 수 없습니다.');
    }
    const boardUpdate = await this.showReporitory.update(
      { id },
      {
        ...(title && { title }),
        ...(background && { background }),
        ...(description && { description }),
      }
    );
    return boardUpdate;
  }

  async delete(id: number) {
    const board = await this.showReporitory.findOne({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException('보드 정보를 찾을 수 없습니다.');
    }
    const boardDelete = await this.showReporitory.delete({ id });
    return boardDelete;
  }

  async invite(id: number, userId: number) {}
}
