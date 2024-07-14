import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { usersUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  async findMe(userId:number){
    const user = await this.userRepository.findOneBy({userId})
    if(!user) throw new NotFoundException('존재하는 데이터가 없습니다.')
    return user
  }

  async updateMe(userId:number, {bio, profileImg}:usersUpdateDto){
    if(!userId) throw new NotFoundException('존재하는 데이터가 없습니다.')
    await this.userRepository.update(
      {userId},
      {bio, profileImg}
    )

    const data = await this.userRepository.findOneBy({userId})

    return data;
  }
}
