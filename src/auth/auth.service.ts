import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './Dto/sign-up.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ){}

  async signUp({email, password, passwordConfirm, bio}:SignUpDto){

    if(password !== passwordConfirm) throw new BadRequestException('두 비밀번호가 일치하지 않습니다.')
    
    const existEmail = await this.userRepository.findOneBy({email})
    console.log(existEmail);
    if(existEmail) throw new NotFoundException ('존재하는 이메일입니다.')
    
    const passwordHash = this.configService.get<string>('PASSWORD_HASH')
    const hashedPassword = bcrypt.hashSync(password, passwordHash)

    const data = await this.userRepository.save({email, password:hashedPassword, bio})

    return data
  }
}
