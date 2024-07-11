import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './Dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}


  @Post('/sign-up')
   async signUp(@Body() signUpDto:SignUpDto){
      const data = await this.authService.signUp(signUpDto)

      return  {
        statuscode: HttpStatus.OK,
        message: '정보조회에 성공하셧습니다.',
        data: {...data, password:undefined}
      }
   }

}
  