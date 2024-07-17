import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  /**
   * 보드 제목
   * @example "수정할 제목을 입력해주세요"
   */
  @IsOptional()
  @IsString()
  title: string;

  /**
   * 보드 설명
   * @example "수정할 설명을 입력해주세요"
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * 배경 색상
   * @example "수정할 색상을 입력해주세요"
   */
  @IsOptional()
  @IsString()
  background: string;
}
