import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(User) private readonly userRepository: Repository<User>

  findMe(id:number){
    const user = this.userRepository.findOneBy({id})
    return user
  }
}
