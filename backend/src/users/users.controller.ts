import { Body, Controller, Get, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { usersUpdateDto } from './dto/user.update.dto';

@ApiTags('USER API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 개인정보조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findMe(@Request() req) {
    const userId = req.user.userId;
    const data = await this.usersService.findMe(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '정상적으로 조회가 완료되었습니다.',
      data: { ...data, password: undefined },
    };
  }

  /**
   * 개인정보수정
   * @param req
   * @param usersUpdateDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/me')
  async updateMe(@Request() req, @Body() usersUpdateDto: usersUpdateDto) {
    const userId = req.user.userId;
    const data = await this.usersService.updateMe(userId, usersUpdateDto);
    return {
      statusCode: HttpStatus.OK,
      message: '정상적으로 조회가 완료되었습니다.',
      data: { ...data, password: undefined },
    };
  }
}
