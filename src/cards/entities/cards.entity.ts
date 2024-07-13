import { IsDate, IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workers } from './workers.entity';

@Entity('cards')
export class Cards {
  @PrimaryGeneratedColumn()
  cardId: number;

  /**
   * 제목
   * @example "API 명세서 작성"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * 상세 설명
   * @example "Restful하게 작성하기"
   */
  @IsNotEmpty({ message: '상세 설명을 입력해주세요.' })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  description: string;

  /**
   * 카드 색상
   * @example "ffffff"
   */
  @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
  @IsHexColor()
  @Column({ type: 'varchar', nullable: false })
  color: string;

  @IsDate()
  @Column({ type: 'varchar', nullable: false })
  startAt: Date;

  @IsDate()
  @Column({ type: 'varchar', nullable: true })
  deadline: Date;

  @Column({type: 'varchar', nullable: false})
  lexoRank: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // ManyToOne(() => Lists, (lists) => lists.cards, { onDelete: 'CASCADE' })
  // lists: Lists;


  @OneToMany(() => Workers, (workers) => workers.cards)
  workers: Workers;
}
