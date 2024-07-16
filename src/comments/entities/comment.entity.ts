import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Cards } from 'src/cards/entities/cards.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  cardId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  userId: number;

  /**
   * 댓글 내용
   * @example '이 부분 검토 부탁드려요'
   */
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  @IsString()
  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Cards, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Cards;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
