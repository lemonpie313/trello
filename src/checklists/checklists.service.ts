import { Injectable, NotFoundException } from '@nestjs/common';
import { Checklists } from './entities/checklists.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUpdateChecklistDto } from './dtos/create-update-checklist.dto';
import _ from 'lodash';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklists) private readonly checklistsRepository: Repository<Checklists>
  ) {}

  async createChecklist(
    userId: number,
    cardId: number,
    createChecklistDto: CreateUpdateChecklistDto
  ) {
    // 인증 함수

    const { content } = createChecklistDto;
    const checklist = await this.checklistsRepository.save({
      content,
      card: {
        cardId,
      },
    });

    return checklist;
  }

  async readChecklists(userId: number, cardId: number) {
    // 인증 함수

    const checklists = await this.checklistsRepository.find({
      where: {
        card: {
          cardId,
        },
      },
    });

    return checklists;
  }

  async updateChecklist(
    userId: number,
    checklistId: number,
    updateChecklistDto: CreateUpdateChecklistDto
  ) {
    // 인증 함수

    const checklist = await this.checklistsRepository.findOne({
      where: {
        checklistId,
      },
    });

    if (_.isNil(checklist)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 체크리스트가 존재하지 않습니다.',
      });
    }
    const { content } = updateChecklistDto;
    await this.checklistsRepository.update({ checklistId }, { content });

    const updatedChecklist = await this.checklistsRepository.findOne({
      where: {
        checklistId,
      },
    });

    return updatedChecklist;
  }

  async deleteChecklist(userId: number, checklistId: number) {
    // 인증 함수

    const checklist = await this.checklistsRepository.findOne({
      where: {
        checklistId,
      },
    });

    if (_.isNil(checklist)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 체크리스트가 존재하지 않습니다.',
      });
    }

    await this.checklistsRepository.delete({ checklistId });
  }
}