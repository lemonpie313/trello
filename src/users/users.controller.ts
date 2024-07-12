import { Controller, Get, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@ApiTags('USER API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService:UsersService){}
  /**
   * findme
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findMe(@Request() req) {
    const userId = req.id;
    const data = this.usersService.findMe(userId)
    return {
        statusCode: HttpStatus.OK,
        message: '테스트 성공.',
        data
      };
    }
}
