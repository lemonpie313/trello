import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BOARD_ROLE } from '../types/board-roles.type';
import { User } from 'src/users/entity/users.entity';
import { Board } from './board.entity';
import { Workers } from 'src/cards/entities/workers.entity';

@Entity('members')
export class Members {
  @PrimaryGeneratedColumn({ unsigned: true })
  memberId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  boardId: number;

  @IsEnum(BOARD_ROLE)
  @Column({ type: 'enum', enum: BOARD_ROLE, default: BOARD_ROLE.MEMBER })
  role: BOARD_ROLE;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne((type) => User, (user) => user.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((type) => Board, (board) => board.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Workers, (workers) => workers.members, { cascade: true })
  workers: Workers;
}
