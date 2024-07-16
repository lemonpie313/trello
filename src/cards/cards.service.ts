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
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Members } from 'src/boards/entities/member.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(Workers) private readonly workersRepository: Repository<Workers>,
    @InjectRepository(Members) private readonly membersRepository: Repository<Members>
  ) {}

  async createCard(userId: number, listId: number, createCardDto: CreateCardDto) {
    const { title, description, color, startDate, startTime } = createCardDto;
    let startAt: Date;
    if (startDate && startTime) {
      startAt = new Date(`${startDate} ${startTime}`);
    } else {
      startAt = new Date();
    }

    const previousCards = await this.cardsRepository.find({
      where: {
        // lists: {
        //   listId,
        // },
      },
    });
    let lexoRank: string;
    if (previousCards.length == 0) {
      lexoRank = LexoRank.middle().toString();
    } else {
      lexoRank = LexoRank.parse(previousCards[previousCards.length - 1].lexoRank)
        .genNext()
        .toString();
    }

    console.log(lexoRank);

    const card = await this.cardsRepository.save({
      title,
      description,
      color,
      startAt,
      lexoRank,
    });
    return card;
  }

  async readAllCards(userId: number, listId: number) {
    // 인증(?)함수

    const cards = await this.cardsRepository.find({
      where: {
        // lists: {
        //   listId,
        // },
      },
      select: {
        cardId: true,
        title: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        lexoRank: 'asc',
      },
    });
    return cards;
  }

  async readCard(userId: number, cardId: number) {
    // 인증(?)함수

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
      relations: {
        workers: true,
      },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    let workers = [];
    for (let worker of card.workers) {
      const workMember = await this.workersRepository.findOne({
        where: {
          workerId: worker.workerId,
          // board: {
          //   boardId,
          // } // 인증 함수에서 가져와질듯
        },
        relations: {
          user: true,
          members: true,
        },
      });
      workers.push({
        userId: workMember.user.userId,
        memberId: workMember.members.memberId,
        email: workMember.user.email,
        profileImg: workMember.user.profileImg,
      });
    }
    return {
      cardId,
      title: card.title,
      description: card.description,
      color: card.color,
      startAt: card.startAt,
      deadline: card.deadline,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      workers,
    };
  }

  async updateCard(userId: number, cardId: number, updateCardDto: UpdateCardDto) {
    // 인증(?)함수

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

  async deleteCard(userId: number, cardId: number) {
    // 인증(?)함수

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

  async updateDeadline(
    userId: number,
    cardId: number,
    createCardDeadlineDto: CreateCardDeadlineDto
  ) {
    // 인증(?)함수 > boardId 반환

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

  /* 미완성 */
  async createWorkers(userId: number, cardId: number, createWorkerDto: CreateWorkerDto) {
    // 인증(?)함수

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
      // 이미 추가돼있는지 확인
      const existsMember = await this.workersRepository.findOne({
        where: {
          members: {
            memberId,
          },
          cards: {
            cardId,
          },
        },
      });
      if (existsMember) {
        continue;
      }

      // 그사람이 멤버가 맞는지 확인
      const member = await this.membersRepository.findOne({
        where: {
          memberId,
          // board: {
          //   boardId,
          // } // 얘는 인증 함수에서 어떻게든 넘어올거같음
        },
        relations: {
          user: true,
        },
      });
      if (_.isNil(member)) {
        throw new NotFoundException({
          status: 404,
          message: '해당 멤버가 존재하지 않습니다.',
        });
      }

      //저장
      await this.workersRepository.save({
        cards: {
          cardId,
        },
        members: {
          memberId,
        },
        user: {
          userId: member.user.userId,
        }
      });
    }

    const updatedCard = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
      relations: {
        workers: true,
      },
    });

    // 업로드한것 조회
    let createdWorkers = [];
    for (let worker of card.workers) {
      const workMember = await this.membersRepository.findOne({
        where: {
          workers: {
            workerId: worker.workerId,
          },
          // board: {
          //   boardId,
          // } // 인증 함수에서 가져와질듯
        },
        relations: {
          user: true,
        },
      });
      createdWorkers.push({
        userId: workMember.user.userId,
        memberId: workMember.memberId,
        email: workMember.user.email,
        profileImg: workMember.user.profileImg,
      });
    }
    return {
      cardId,
      title: card.title,
      description: card.description,
      color: card.color,
      startAt: card.startAt,
      deadline: card.deadline,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      workers,
    };
  }

  /*worker 삭제 기능 추가해야함..!!!! */

  async updateOrder(userId: number, cardId: number, updateOrderDto: UpdateOrderDto) {
    // 인증(?)함수

    const { rank } = updateOrderDto;

    const card = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
      // relations: {
      //   lists: true,
      // },
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }

    const cards = await this.cardsRepository.find({
      where: {
        // lists: {
        //   listId: card.lists.listId,
        // },
      },
      order: {
        lexoRank: 'asc',
      },
    });
    let lexoRank: string;
    if (rank >= cards.length) {
      lexoRank = LexoRank.parse(cards[cards.length - 2].lexoRank)
        .genNext()
        .toString();
    } else if (rank <= 1) {
      lexoRank = LexoRank.parse(cards[0].lexoRank).genPrev().toString();
    } else {
      lexoRank = LexoRank.parse(cards[rank - 1].lexoRank)
        .between(LexoRank.parse(cards[rank].lexoRank))
        .toString();
    }

    await this.cardsRepository.update(
      { cardId },
      {
        lexoRank,
      }
    );
    const updatedCards = await this.cardsRepository.find({
      where: {
        // lists: {
        //   listId: card.lists.listId,
        // },
      },
      select: {
        cardId: true,
        title: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        lexoRank: 'asc',
      },
    });
    return updatedCards;
  }
}
