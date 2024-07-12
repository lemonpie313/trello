import { PickType } from '@nestjs/swagger';
import { Cards } from '../entities/cards.entity';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  startTime: string;
}
