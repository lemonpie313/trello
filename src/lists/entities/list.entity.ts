import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Board } from 'src/boards/entities/board.entity';
import { Cards } from 'src/cards/entities/cards.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lists {
  @PrimaryGeneratedColumn()
  listId: number;

  /**
   * 제목
   * @example '해야할일'
   */
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @Column()
  @IsNumber()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  // board: Board;

  @OneToMany(() => Cards, (cards) => cards.lists, { cascade: true })
  cards: Cards;
}
