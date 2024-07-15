import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkerDto {
  /**
   * 작업 할당자
   * @example [1, 2, 3]
   */
  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
    }
  )
  @IsNotEmpty({ message: '할당자 id를 입력해주세요.' })
  workers: number[];
}
