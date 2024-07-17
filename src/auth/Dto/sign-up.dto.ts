import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entity/users.entity';

export class SignUpDto extends PickType(User, ['email', 'password', 'bio', 'name']) {
  /**
   * 비밀번호 확인
   * @example '!123Example'
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;
}
