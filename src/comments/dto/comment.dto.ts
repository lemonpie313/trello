import { PickType } from "@nestjs/swagger";
import { Comment } from '../entities/comment.entity'

export class CommentDto extends PickType(Comment, ['content']){ }
