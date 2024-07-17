import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { User } from 'src/users/entity/users.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(Workers) private readonly workersRepository: Repository<Workers>,
    @InjectRepository(Members) private readonly membersRepository: Repository<Members>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly authService: AuthService
  ) {}

  async createCard(userId: number, listId: number, createCardDto: CreateCardDto) {
    await this.authService.validateListToMember(listId, userId);
    const { title, description, color, startDate, startTime } = createCardDto;
    let startAt: Date;
    if (startDate && startTime) {
      startAt = new Date(`${startDate} ${startTime}`);
    } else {
      startAt = new Date();
    }

    const previousCards = await this.cardsRepository.find({
      where: {
        lists: {
          listId,
        },
      },
      order: {
        lexoRank: 'ASC',
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
    const card = await this.cardsRepository.save({
      title,
      description,
      color,
      startAt,
      lexoRank,
      lists: {
        listId,
      },
    });

    return card;
  }

  async readAllCards(userId: number, listId: number) {
    await this.authService.validateListToMember(listId, userId);
    const cards = await this.cardsRepository.find({
      where: {
        lists: {
          listId,
        },
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
    const member = await this.authService.validateCardToMember(cardId, userId);

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
          members: {
            boardId: member.boardId,
          },
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
    await this.authService.validateCardToMember(cardId, userId);

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
      relations: ['workers', 'workers.user'],
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    // 인증 함수, 사용자가 속한 보드의 카드가 아닐 경우 에러 반환

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

    //수정 유저 이름 조회
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['name'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    // 카드 수정 알림 전송
    for (const worker of card.workers) {
      this.notificationsGateway.sendNotification(
        worker.user.userId,
        `${user.name}님이 ${title} 카드를 수정했습니다.`
      );
    }
    return updatedCard;
  }

  async deleteCard(userId: number, cardId: number) {
    await this.authService.validateCardToMember(cardId, userId);
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
    // 인증(?)함수
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
    await this.authService.validateCardToMember(cardId, userId);
    const { dueDate, dueTime } = createCardDeadlineDto;
    const deadline = new Date(`${dueDate} ${dueTime}`);

    const card = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
      relations: ['workers', 'workers.user'],
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    // 인증(?)함수 > boardId 반환
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

    //유저 이름 조회
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['name'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    //카드 마감일자 알림 전송
    for (const worker of card.workers) {
      this.notificationsGateway.sendNotification(
        worker.user.userId,
        `${user.name}님이 ${updatedCard.title} 카드 마감일자를 등록했습니다.`
      );
    }
    return updatedCard;
  }

  async createWorkers(userId: number, cardId: number, createWorkerDto: CreateWorkerDto) {
    await this.authService.validateCardToMember(cardId, userId);

    const card = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
      relations: ['workers', 'workers.user'],
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }
    //유저 이름 조회
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['name'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    // workers 가 members에 해당되는지 봐야됨
    const { workers } = createWorkerDto;
    for (const inviteId of workers) {
      // 이미 추가돼있는지 확인
      const existsMember = await this.workersRepository.findOne({
        where: {
          userId: inviteId,
          cards: {
            cardId,
          },
        },
      });
      if (existsMember) {
        throw new BadRequestException('이미 등록된 작업자입니다.');
      }

      // 그사람이 멤버가 맞는지 확인
      const member = await this.authService.validateCardToMember(cardId, inviteId);

      const mailMember = await this.membersRepository.findOne({
        where: { userId: inviteId },
        relations: ['user'],
      });

      //저장
      await this.workersRepository.save({
        cardId,
        memberId: member.memberId,
        userId: member.userId,
      });

      // // 멤버 추가 알림 전송
      for (const worker of card.workers) {
        this.notificationsGateway.sendNotification(
          worker.user.userId,
          `${user.name}님이 ${mailMember.user.name}님을 ${card.title} 카드의 멤버로 초대했습니다.`
        );
      }

      //초대받은 멤버 알림 전송
      this.notificationsGateway.sendNotification(
        mailMember.user.userId,
        `${user.name}님이 ${mailMember.user.name}님을 ${card.title} 카드에 초대했습니다.`
      );
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
    for (let worker of updatedCard.workers) {
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
          workers: true,
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
      title: updatedCard.title,
      description: updatedCard.description,
      color: updatedCard.color,
      startAt: updatedCard.startAt,
      deadline: updatedCard.deadline,
      createdAt: updatedCard.createdAt,
      updatedAt: updatedCard.updatedAt,
      createdWorkers,
    };
  }

  /*worker 삭제 기능 추가해야함..!!!! */

  async updateOrder(userId: number, cardId: number, updateOrderDto: UpdateOrderDto) {
    // 인증(?)함수
    await this.authService.validateCardToMember(userId, cardId);

    const { movedCardId } = updateOrderDto;

    const card = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
      relations: ['lists', 'workers', 'workers.user'],
    });
    if (_.isNil(card)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 카드가 존재하지 않습니다.',
      });
    }

    const cards = await this.cardsRepository.find({
      where: {
        lists: {
          listId: card.lists.listId,
        },
      },
      order: {
        lexoRank: 'ASC',
      },
    });
    let lexoRank: string;
    const findIndex = cards.findIndex((el) => el.cardId == movedCardId);
    if (findIndex === cards.length - 1) {
      lexoRank = LexoRank.parse(cards[findIndex].lexoRank).genNext().toString();
    } else if (movedCardId == -1) {
      lexoRank = LexoRank.parse(cards[0].lexoRank).genPrev().toString();
    } else {
      lexoRank = LexoRank.parse(cards[findIndex].lexoRank)
        .between(LexoRank.parse(cards[findIndex + 1].lexoRank))
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
        lists: {
          listId: card.lists.listId,
        },
      },
      select: {
        cardId: true,
        title: true,
        color: true,
        lexoRank: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        lexoRank: 'ASC',
      },
    });

    //유저 이름 조회
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['name'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    // 카드 상태 변경 알림 전송
    for (const worker of card.workers) {
      this.notificationsGateway.sendNotification(
        worker.user.userId,
        `${user.name}님이 ${card.title} 카드의 위치를 변경했습니다.`
      );
    }

    return updatedCards;
  }

  async moveCardToList(userId: number, cardId: number, movedListId: number) {
    console.log(userId);
    console.log(cardId);
    console.log(movedListId);
    await this.authService.validateCardToMember(cardId, userId);
    await this.authService.validateListToMember(movedListId, userId);

    const previousCards = await this.cardsRepository.find({
      where: {
        lists: {
          listId: movedListId,
        },
      },
      order: {
        lexoRank: 'ASC',
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

    await this.cardsRepository.update(
      { cardId },
      {
        listId: movedListId,
        lexoRank,
      }
    );

    const card = await this.cardsRepository.findOne({
      where: {
        cardId,
      },
    });
    return card;
  }
}
