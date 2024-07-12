import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('테스트')
@Controller('users')
export class UsersController {
  /**
   * 테스트용
   * @returns
   */
  @Get('/me')
  async findMe() {
    return {
      statusCode: HttpStatus.OK,
      message: '테스트 성공.',
    };
  }
}
