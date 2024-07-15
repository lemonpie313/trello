import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService:JwtService,
  ){}

  async signUp({email, password, passwordConfirm, bio}:SignUpDto){

    if(password !== passwordConfirm) throw new BadRequestException('두 비밀번호가 일치하지 않습니다.')
    
    const existEmail = await this.userRepository.findOneBy({email})
    if(existEmail) throw new NotFoundException ('존재하는 이메일입니다.')
    
    const passwordHash = this.configService.get<string>('PASSWORD_HASH')
    const hashedPassword = bcrypt.hashSync(password, passwordHash)

    const data = await this.userRepository.save({email, password:hashedPassword, bio})

    return data
  }

  async signIn(userId:number){
    const payload = { id:userId }
    const accesstoken = this.jwtService.sign(payload)

    return accesstoken
  }

  async validateUser({email, password} : SignInDto){
    const user = await this.userRepository.findOneBy({email})
    console.log(user)
    if(!user) throw new NotFoundException ('존재하지 않는 유저입니다.')

    const comparedPassword = bcrypt.compareSync(password, user.password);
    if(!comparedPassword) throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    return user 
  }
}
