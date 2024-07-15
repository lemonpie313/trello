import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDto {
  /**
   * 이동할 순서
   * @example "0"
   */
  @IsNotEmpty({ message: '이동하려는 순서를 입력해주세요.' })
  @IsString()
  rank: number;
}
