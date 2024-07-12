import { Body, Controller, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);

    return {
      statuscode: HttpStatus.OK,
      message: '회원가입에 성공하셧습니다.',
      data: { ...data, password: undefined },
    };
  }

  /**
   * 로그인
   * @param req
   * @param signIpDto
   * @returns
   */
  @UseGuards(AuthGuard('customlocal'))
  @Post('/sign-in')
  async signIn(@Request() req, @Body() SignInDto: SignInDto) {
    const userId = req.user.id;
    const data = await this.authService.signIn(userId);

    return {
      statuscode: HttpStatus.OK,
      message: '로그인에 성공하셧습니다.',
      data,
    };
  }
}
