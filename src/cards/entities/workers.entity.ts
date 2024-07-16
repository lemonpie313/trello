import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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

  // @Column()
  // memberId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Cards, (cards) => cards.workers, { onDelete: 'CASCADE' })
  cards: Cards;

  @ManyToOne(() => Members, (members) => members.workers, { onDelete: 'CASCADE' })
  members: Members;

  @ManyToOne(() => User, (user) => user.workers, { onDelete: 'CASCADE' })
  user: User;
}
