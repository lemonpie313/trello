import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(Board) private readonly showReporitory: Repository<Board>) {}

  async create(createBoardDto: CreateBoardDto) {
    const board = await this.showReporitory.save({
      ...createBoardDto,
    });
    return board;
  }
}
