import { PickType } from '@nestjs/swagger';
import { User } from 'src/users/entity/users.entity';

export class SignInDto extends PickType(User, ['email', 'password']) {}
