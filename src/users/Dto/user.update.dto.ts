import { PickType } from "@nestjs/swagger";
import { User } from "../entity/users.entity";

export class usersUpdateDto extends PickType(User,['bio','profileImg']){}