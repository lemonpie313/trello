import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true, nullable: true })
  ownerID: number;

  /**
   * 보드 제목
   * @example "To-do"
   */
  @IsNotEmpty({ message: '보드 제목을 입력해주세요' })
  @IsString()
  @Column()
  title: string;

  /**
   * 보드 색상
   * @example "#FFFF00"
   */
  @IsNotEmpty({ message: '보드의 배경 색상을 입력해주세요.' })
  @IsString()
  @Column()
  background: string;

  /**
   * 보드 설명
   * @example "해당 보드는 테스트용입니다."
   */
  @IsString()
  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
