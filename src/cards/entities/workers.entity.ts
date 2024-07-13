import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from './cards.entity';
import { Members } from 'src/boards/entities/member.entity';

@Entity('workers')
export class Workers {
  @PrimaryGeneratedColumn()
  workerId: number;

  @ManyToOne(() => Cards, (cards) => cards.workers, { onDelete: 'CASCADE' })
  cards: Cards;

  @Column()
  memberId: number;

  @ManyToOne(() => Members, (members) => members.workers, { onDelete: 'CASCADE' })
  members: Members;
}
