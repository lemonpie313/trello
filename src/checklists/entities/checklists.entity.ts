import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Cards } from 'src/cards/entities/cards.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('checklists')
export class Checklists {
  @PrimaryGeneratedColumn({ unsigned: true })
  checklistId: number;

  /**
   * 체크리스트 내용
   * @example "To-do"
   */
  @IsString()
  @IsNotEmpty({ message: '체크리스트 내용을 입력해주세요.' })
  @Column()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  @Column({ type: 'boolean', nullable: false, default: false })
  isChecked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Cards, (cards) => cards.checklists, { onDelete: 'CASCADE' })
  cards: Cards;
}
