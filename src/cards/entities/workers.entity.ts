import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cards } from './cards.entity';
import { Members } from 'src/boards/entities/member.entity';
import { User } from 'src/users/entity/users.entity';

@Entity('workers')
@Index('unique_active_column', ['cards', 'members'], { where: '"deletedAt" IS NULL' })
export class Workers {
  @PrimaryGeneratedColumn()
  workerId: number;

  @Column()
  cardId: number;

  @Column()
  memberId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Cards, (cards) => cards.workers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  cards: Cards;

  @ManyToOne(() => Members, (members) => members.workers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  members: Members;

  @ManyToOne(() => User, (user) => user.workers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
