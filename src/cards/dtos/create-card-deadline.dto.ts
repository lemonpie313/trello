import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCardDeadlineDto {
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
  @Matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, { message: '마감 시간을 양식에 맞게 입력해주세요.' })
  @IsString()
  dueTime: string;
}
