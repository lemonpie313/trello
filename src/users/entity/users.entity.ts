import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Members } from 'src/boards/entities/member.entity';
import { Workers } from 'src/cards/entities/workers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from "src/comments/entities/comment.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  userId: number;

  /**
   * 이메일
   * @example 'example@sparta.com'
   */
  @ApiProperty()
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @IsEmail({}, { message: '이메일 형식에 맞게 작성해주세요.' })
  @Column({ unique: true })
  email: string;

  /**
   * 패스워드
   * @example '!123Example'
   */
  @ApiProperty()
  @IsNotEmpty({ message: '패스워드를 작성해주세요.' })
  @IsStrongPassword(
    {},
    { message: '비밀번호는 영문 알파벳 대,소문자,숫자, 특수문자등을 사용해주세요.' }
  )
  @Column()
  password: string;

  /**
   * 설명
   * @example '안녕하세요. 반갑습니다'
   */
  @ApiProperty()
  @IsNotEmpty({ message: '소개를 작성해주세요.' })
  @IsString()
  @Column({ type: 'text' })
  bio: string;

  /**
   * 이미지
   * @example 'wekfjowefm.jpg'
   */
  @ApiProperty()
  @IsString()
  @Column()
  profileImg?: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Members, (member) => member.user)
  members: Members[];

@OneToMany(() => Workers, (workers) => workers.user)
workers: Workers[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]

  }

