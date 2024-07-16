import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from './entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dtos/create-list.dto';
import { LexoRank } from 'lexorank';
import { AuthService } from 'src/auth/auth.service';
import _ from 'lodash';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Lists) private readonly listsRepository: Repository<Lists>,
    private readonly authService: AuthService
  ) {}

  async createlist(boardId: number, { title }: CreateListDto, userId: number) {
    await this.authService.validateMember(boardId, userId);
    const listAllFind = await this.listsRepository.find({
      where: { board: { boardId } },
    });
    if (listAllFind.length > 0) {
      const order = LexoRank.parse(listAllFind[listAllFind.length - 1].order)
        .genNext()
        .toString();
      const data = await this.listsRepository.save({
        title,
        board: {
          boardId,
        },
        order,
      });
      return data;
    } else {
      const order = LexoRank.middle().toString();
      const data = await this.listsRepository.save({
        title,
        board: {
          boardId,
        },
        order,
      });
      return data;
    }
  }

  async findAllList(boardId: number, userId: number) {
    await this.authService.validateMember(boardId, userId);
    const data = this.listsRepository.find({
      where: { board: { boardId } },
      order: { order: 'ASC' },
      relations: ['cards'],
      select: {
        cards: {
          title: true,
          description: true,
          startAt: true,
          deadline: true,
        },
      },
    });

    return data;
  }

  async updateList(listId: number, { title }: CreateListDto, userId: number) {
    await this.authService.validateListToMember(listId, userId);
    const list = await this.listsRepository.findOne({
      where: {
        listId,
      },
    });
    if (_.isNil(list)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 리스트를 찾을 수 없습니다.',
      });
    }
    await this.listsRepository.update({ listId }, { title });
    const data = await this.listsRepository.findOneBy({ listId });
    return data;
  }

  async deleteList(listId: number, userId: number) {
    await this.authService.validateListToMember(listId, userId);
    const list = await this.listsRepository.findOne({
      where: {
        listId,
      },
    });
    if (_.isNil(list)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 리스트를 찾을 수 없습니다.',
      });
    }

    await this.listsRepository.delete({ listId });

    return true;
  }

  async moveList(listId: number, boardId: number, movedListId: number, userId: number) {
    await this.authService.validateMember(boardId, userId);
    const listAllFind = await this.listsRepository.find({
      where: { board: { boardId } },
      order: { order: 'ASC' },
    });

    let newLexo: string;

    const findIndex = listAllFind.findIndex((el) => el.listId === movedListId);

    if (findIndex === listAllFind.length - 1) {
      newLexo = LexoRank.parse(listAllFind[findIndex].order).genNext().toString();
    } else if (movedListId === -1) {
      newLexo = LexoRank.parse(listAllFind[0].order).genPrev().toString();
    } else {
      newLexo = LexoRank.parse(listAllFind[findIndex].order)
        .between(LexoRank.parse(listAllFind[findIndex + 1].order))
        .toString();
    }

    const data = await this.listsRepository.update({ listId }, { order: newLexo });

    return data;
  }
}
