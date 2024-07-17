import { PickType } from '@nestjs/swagger';
import { Checklists } from '../entities/checklists.entity';

export class CreateUpdateChecklistDto extends PickType(Checklists, ['content']) {}
