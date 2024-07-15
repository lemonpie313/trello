import { IsDate, IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { Lists } from 'src/lists/entities/list.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cards')
export class Cards {
  @PrimaryGeneratedColumn()
  cardId: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  member: string;

  /**
   * 제목
   * @example "API 명세서 작성"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  @Column()
  title: string;

  /**
   * 상세 설명
   * @example "Restful하게 작성하기"
   */
  @IsNotEmpty({ message: '상세 설명을 입력해주세요.' })
  @IsString()
  @Column()
  description: string;

  /**
   * 카드 색상
   * @example "ffffff"
   */
  @IsNotEmpty({ message: '카드 색상을 입력해주세요.'})
  @IsHexColor()
  @Column()
  color: string;

  @IsNotEmpty()
  @IsDate()
  @Column()
  startAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Column()
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type)=>Lists, Lists=>Lists.cards, {onDelete:'CASCADE'})
  lists:Lists
}
