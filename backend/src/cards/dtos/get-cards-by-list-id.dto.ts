import { IsNotEmpty, IsString } from 'class-validator';

export class GetCardsByListIdDto {
  /**
   * 리스트 id
   * @example "1"
   */
  @IsNotEmpty({ message: '리스트 id를 입력해주세요.' })
  @IsString()
  listId: number;
}
