import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Cards } from "src/cards/entities/cards.entity";
import { User } from "src/users/entity/users.entity";
import { Column, CreateDateColumn, Entity,  ManyToOne,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn({ unsigned: true })
    commentId: number;

    @IsNotEmpty()
    @IsNumber()
    @Column({ unsigned: true})
    cardId: number;

    @IsNotEmpty()
    @IsNumber()
    @Column({ unsigned: true})
    userId: number;

    /**
     * 댓글 내용
     * @example '이 부분 검토 부탁드려요'
     */
    @IsNotEmpty({message: "댓글 내용을 입력해주세요."})
    @IsString()
    @Column({type: 'text'})
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Cards, card => card.comments)
    card: Cards

    @ManyToOne(() => User, user => user.comments, {onDelete: 'CASCADE'})
    user: User
}
