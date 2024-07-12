import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { Cards } from './entities/cards.entity';
import { Repository } from 'typeorm';
import { UpdateCardDto } from './dtos/update-card.dto';
import _ from 'lodash';
import { CreateCardDeadlineDto } from './dtos/create-card-deadline.dto';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Cards) private readonly cardRepository: Repository<Cards>) {}

  async createCard(createCardDto: CreateCardDto) {
    const { title, description, color, startDate, startTime } = createCardDto;
    let startAt: Date;
    if (startDate && startTime) {
      startAt = new Date(`${startDate} ${startTime}`);
    }
    startAt = new Date();
    const card = await this.cardRepository.save({
      member: '와',
      title,
      description,
      color,
      startAt,
    });
    return card;
  }

  async readAllCards(listId: number) {
    const cards = await this.cardRepository.find({
      where: {
        // list: {
        //   listId,
        // }
      },
      select: {
        cardId: true,
        title: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return cards;
  }

  async readCard(cardId: number) {
    const card = await this.cardRepository.findOne({
      where: {
        cardId,
      },
      select: {
        cardId: true,
        title: true,
        member: true,
        description: true,
        color: true,
        startAt: true,
        deadline: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    return card;
  }

  async updateCard(cardId: number, updateCardDto: UpdateCardDto) {
    const { title, description, color, startDate, startTime, dueDate, dueTime } = updateCardDto;
    let startAt: Date;
    let deadline: Date;
    if (startDate && startTime) {
      startAt = new Date(`${startDate} ${startTime}`);
    }
    if (dueDate && dueTime) {
      deadline = new Date(`${dueDate} ${dueTime}`);
    }

    const card = await this.cardRepository.findOne({
      where: {
        cardId,
      },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    // 사용자가 만든 카드가 아닐 경우 권한 없다고 에러

    await this.cardRepository.update(
      { cardId },
      {
        title,
        description,
        color,
        startAt,
        deadline,
      }
    );

    const updatedCard = await this.cardRepository.findOne({
      where: {
        cardId,
      },
      select: {
        cardId: true,
        title: true,
        description: true,
        color: true,
        startAt: true,
        deadline: true,
        member: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedCard;
  }

  async deleteCard(cardId: number) {
    const card = await this.cardRepository.findOne({
      where: {
        cardId,
      },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    // 사용자가 만든 카드가 아닐 경우 권한 없다고 에러

    await this.cardRepository.softDelete({
      cardId,
    });
  }

  async updateDeadline(cardId: number, createCardDeadlineDto: CreateCardDeadlineDto) {
    const { dueDate, dueTime } = createCardDeadlineDto;
    const deadline = new Date(`${dueDate} ${dueTime}`);

    const card = await this.cardRepository.findOne({
      where: {
        cardId,
      },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    // 사용자가 만든 카드가 아닐 경우 권한 없다고 에러

    await this.cardRepository.update(
      { cardId },
      {
        deadline,
      }
    );
    const updatedCard = await this.cardRepository.findOne({
      where: {
        cardId,
      },
      select: {
        cardId: true,
        title: true,
        description: true,
        color: true,
        startAt: true,
        deadline: true,
        member: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedCard;
  }
}
