import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from './entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dtos/create-list.dto';

@Injectable()
export class ListsService {
  constructor(@InjectRepository(Lists) private readonly listsRepository: Repository<Lists> ){}

  async createlist( boardId:number, {title}:CreateListDto){
    //boardId로 찾아서 없으면 에러 -- 
    const data = this.listsRepository.save({boardId, title})

    return data
  }

  async findAllList(){
    const data = this.listsRepository.find()

    return data
  }

  async updateList(boardId:number, listId:number, {title}:CreateListDto){
    await this.listsRepository.update(
      {listId, boardId},
    {title})
    const data = await this.listsRepository.findOneBy({listId,boardId})
    return data
  }

  async deleteList(boardId:number, listId:number){
    console.log(boardId,listId);
    await this.listsRepository.delete({boardId, listId})

    return true
  }
}
