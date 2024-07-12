import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { usersUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private readonly userRepository: Repository<User>

  async findMe(id:number){
    const user = await this.userRepository.findOneBy({id})
    if(!user) throw new NotFoundException('존재하는 데이터가 없습니다.')
    return user
  }

  async updateMe(id:number, {bio, profileImg}:usersUpdateDto){
    if(!id) throw new NotFoundException('존재하는 데이터가 없습니다.')
    await this.userRepository.update(
      {id},
      {bio, profileImg}
    )

    const data = await this.userRepository.findOneBy({id})

    return data
  }
}
