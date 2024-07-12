import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { Cards } from './entities/cards.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService {
    constructor(@InjectRepository(Cards) private readonly cardReporitory: Repository<Cards>) {}

    async createCard(createCardDto: CreateCardDto) {
      const { title, description, color, startDate, startTime, dueDate, dueTime } = createCardDto;
      const startAt = new Date(`${startDate} ${startTime}`);
      const deadline = new Date(`${dueDate} ${dueTime}`);
      const card = await this.cardReporitory.save({
        member: '와',
        title,
        description,
        color,
        startAt,
        deadline,
      });
      return card;
    }

    async readAllCards(listId) {
      const cards = await this.cardReporitory.find({
        where: {
          // list: {
          //   listId,
          // }
        }
      });
      return cards;
    }
}
