import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './Dto/sign-up.dto';
import { SignInDto } from './Dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}


  @Post('/sign-up')
   async signUp(@Body() signUpDto:SignUpDto){
      const data = await this.authService.signUp(signUpDto)

      return  {
        statuscode: HttpStatus.OK,
        message: '회원가입에 성공하셧습니다.',
        data: {...data, password:undefined}
      }
   }

  @Post('/sign-in')
   async signIn(@Body() signInDto:SignInDto){
    const data = await this.authService.signIn(signInDto);

    return  {
      statuscode: HttpStatus.OK,
      message: '로그인에 성공하셧습니다.',
      data
    }
   }
}
  