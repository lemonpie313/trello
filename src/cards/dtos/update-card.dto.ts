import { IsDateString, IsHexColor, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCardDto {
  /**
   * 제목
   * @example "API 명세서 작성"
   */
  @IsOptional()
  @IsString()
  title: string;

  /**
   * 상세 설명
   * @example "Restful하게 작성하기"
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * 카드 색상
   * @example "ffffff"
   */
  @IsOptional()
  @IsHexColor()
  color: string;
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
  @Matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, { message: '시작 시간을 양식에 맞게 입력해주세요.' })
  @IsString()
  startTime: string;

  /**
   * 마감 날짜
   * @example "2024-08-24"
   */
  @IsOptional()
  @IsDateString({}, { message: '마감 날짜를 양식에 맞게 입력해주세요.' })
  dueDate: string;

  /**
   * 마감 시간
   * @example "12:00"
   */
  @IsOptional()
  @IsString()
  dueTime: string;
}
