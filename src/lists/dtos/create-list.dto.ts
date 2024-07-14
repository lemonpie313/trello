import { PickType } from "@nestjs/swagger";
import { Lists } from "../entities/list.entity";

export class CreateListDto extends PickType(Lists,['title']){}