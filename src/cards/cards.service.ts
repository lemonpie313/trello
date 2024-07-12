import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { Cards } from './entities/cards.entity';
import { Repository } from 'typeorm';
import { UpdateCardDto } from './dtos/update-card.dto';
import _ from 'lodash';
import { CreateCardDeadlineDto } from './dtos/create-card-deadline.dto';
import { CreateWorkerDto } from './dtos/create-worker.dto';
import { Workers } from './entities/workers.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(Workers) private readonly workersRepository: Repository<Workers>
  ) {}

  async createCard(createCardDto: CreateCardDto) {
    const { title, description, color, startDate, startTime } = createCardDto;
    let startAt: Date;
    if (startDate && startTime) {
      startAt = new Date(`${startDate} ${startTime}`);
    } else {
      startAt = new Date();
    }


    const previousCards = await this.cardsRepository.find({
      // where: {
      //   cardId,
      // },
    });
    let lexo: string;
    if (previousCards.length == 0) {
      lexo = LexoRank.middle().toString();
    } else {
      lexo = LexoRank.parse(previousCards[previousCards.length - 1].lexo)
      .genNext()
      .toString();
    }

    console.log(lexo);

    const card = await this.cardsRepository.save({
      title,
      description,
      color,
      startAt,
      lexo,
    });
    return card;
  }

  async readAllCards(listId: number) {
    const cards = await this.cardsRepository.find({
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
    const card = await this.cardsRepository.findOne({
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

    const card = await this.cardsRepository.findOne({
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
    // 사용자가 속한 보드의 카드가 아닐 경우 에러 반환

    await this.cardsRepository.update(
      { cardId },
      {
        title,
        description,
        color,
        startAt,
        deadline,
      }
    );

    const updatedCard = await this.cardsRepository.findOne({
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
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedCard;
  }

  async deleteCard(cardId: number) {
    const card = await this.cardsRepository.findOne({
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
    // 사용자가 속한 보드의 카드가 아닐 경우 에러 반환

    await this.cardsRepository.softDelete({
      cardId,
    });
  }

  async updateDeadline(cardId: number, createCardDeadlineDto: CreateCardDeadlineDto) {
    const { dueDate, dueTime } = createCardDeadlineDto;
    const deadline = new Date(`${dueDate} ${dueTime}`);

    const card = await this.cardsRepository.findOne({
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

    await this.cardsRepository.update(
      { cardId },
      {
        deadline,
      }
    );
    const updatedCard = await this.cardsRepository.findOne({
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
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedCard;
  }

  async createWorkers(cardId: number, createWorkerDto: CreateWorkerDto) {
    const card = await this.cardsRepository.findOne({
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
    // workers 가 members에 해당되는지 봐야됨
    const { workers } = createWorkerDto;
    for (const memberId of workers) {
      await this.workersRepository.save({
        card: {
          cardId,
        },
        memberId,
      });
    }
  }
}
