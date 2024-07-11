import { PickType } from '@nestjs/swagger';
import { Cards } from '../entities/cards.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto extends PickType(Cards, ['title', 'description', 'color']) {
  /**
   * 시작 날짜
   * @example "2024-08-06"
   */
  @IsNotEmpty({ message: '시작 날짜를 입력해주세요.' })
  @IsDateString({}, { message: '시작 날짜를 양식에 맞게 입력해주세요.' })
  startDate: string;

  /**
   * 시작 시간
   * @example "12:00"
   */
  @IsNotEmpty({ message: '시작 시간을 입력해주세요.' })
  @IsString()
  startTime: string;

  /**
   * 마감 날짜
   * @example "2024-08-24"
   */
  @IsNotEmpty({ message: '마감 날짜를 입력해주세요.' })
  @IsDateString({}, { message: '마감 날짜를 양식에 맞게 입력해주세요.' })
  dueDate: string;

  /**
   * 마감 시간
   * @example "12:00"
   */
  @IsNotEmpty({ message: '마감 시간을 입력해주세요.' })
  @IsString()
  dueTime: string;
}
