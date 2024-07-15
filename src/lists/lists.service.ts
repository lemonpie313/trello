import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from './entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dtos/create-list.dto';
import { Board } from 'src/boards/entities/board.entity';
import _ from 'lodash';
import { LexoRank } from 'lexorank';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Lists) private readonly listsRepository: Repository<Lists>
    //@InjectRepository(Board) private readonly boardRepository: Repository<Board>
  ) {}

  async createlist(boardId: number, { title }: CreateListDto) {
    //boardId로 찾아서 없으면 에러 --
    // const board = await this.boardRepository.findOne({
    //   where: {
    //     boardId,
    //   },
    // });
    // if (_.isNil(board)) {
    //   throw new NotFoundException({
    //     status: 404,
    //     message: '해당 보드가 존재하지 않습니다.',
    //   });
    // }

    // const previousLists = await this.listsRepository.find({
    //   where: {
    //     board: {
    //       boardId,
    //     },
    //   },
    // });

    // let lexoRank: string;
    // if (previousLists.length == 0) {
    //   lexoRank = LexoRank.middle().toString();
    // } else {
    //   lexoRank = LexoRank.parse(previousLists[previousLists.length - 1].lexoRank)
    //     .genNext()
    //     .toString();
    // }

    const data = this.listsRepository.save({ boardId, title });

    return data;
  }

  async findAllList() {
    const data = this.listsRepository.find();

    return data;
  }

  async updateList(boardId: number, listId: number, { title }: CreateListDto) {
    await this.listsRepository.update({ listId, boardId }, { title });
    const data = await this.listsRepository.findOneBy({ listId, boardId });
    return data;
  }

  async deleteList(boardId: number, listId: number) {
    console.log(boardId, listId);
    await this.listsRepository.delete({ boardId, listId });
    return true;
  }
}
