import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LexoRank } from "lexorank";
import { Cards } from "src/cards/entities/cards.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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

  @Column({type:'varchar'})
  order:LexoRank

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date

  @OneToMany((type)=>Cards, cards=>cards.lists)
  cards:Cards[]
}