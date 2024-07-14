import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Lists {
  @PrimaryGeneratedColumn()
  listId:number

  @Column()
  @IsNumber()
  @IsNotEmpty()
  boardId:number

  /**
  * 제목
  * @example '해야할일'
  */
  @Column()
  @IsString()
  @IsNotEmpty()
  title:string

  @Column()
  @IsNumber()
  order:number

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date
}