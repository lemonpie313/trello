import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from './cards.entity';

@Entity('workers')
export class Workers {
  @PrimaryGeneratedColumn()
  workerId: number;

  @ManyToOne(() => Cards, (card) => card.workers, { onDelete: 'CASCADE' })
  card: Cards;

  @Column()
  memberId: number;

  // @ManyToOne(() => Members, (members) => members.workers)
  // members: Members;
}
