import { PickType } from '@nestjs/swagger';
import { Cards } from '../entities/cards.entity';
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCardDto extends PickType(Cards, ['title', 'description', 'color']) {
  /**
   * 시작 날짜
   * @example "2024-08-06"
   */
  @IsOptional()
  @IsDateString({}, { message: '시작 날짜를 양식에 맞게 입력해주세요.' })
  startDate: string;

  /**
   * 시작 시간
   * @example "12:00"
   */
  @IsOptional()
  @Matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: '시작 시간을 양식에 맞게 입력해주세요.',
  })
  @IsString()
  startTime: string;
}
