import { PickType } from '@nestjs/swagger';
import { Checklists } from '../entities/checklists.entity';

export class ActivateChecklistDto extends PickType(Checklists, ['isChecked']) {}
