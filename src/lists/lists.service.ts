import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from './entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dtos/create-list.dto';
import { LexoRank } from 'lexorank';

@Injectable()
export class ListsService {
  constructor(@InjectRepository(Lists) private readonly listsRepository: Repository<Lists> ){}

  async createlist(boardId:number, {title}:CreateListDto){
    const listAllFind = await this.listsRepository.find({
      where: { boardId }
  });

  listAllFind.forEach(list => {
    list.order = LexoRank.parse(list.order.toString());
});

    const order = LexoRank.middle();
    if (listAllFind.length > 0) {
      const newLexo = listAllFind[listAllFind.length - 1].order.genNext();
      const data = await this.listsRepository.save({title,boardId, order:newLexo.toString()})
      return data
    }
    const data = await this.listsRepository.save({title,boardId, order:order.toString()})
    return data
  }

  async findAllList(boardId:number){
    const data = this.listsRepository.find({
      where: {boardId},
      order: {order:"ASC"},
      relations:['cards'],     
      select: {
        cards: {
          member:true,
          title:true,
          description:true,
          startAt:true,
          deadline:true,
        }
      }
    })

    return data
  }

  async updateList(listId:number, {title}:CreateListDto){
    await this.listsRepository.update(
      {listId},
    {title})
    const data = await this.listsRepository.findOneBy({listId})
    return data
  }

  async deleteList(listId:number){
    await this.listsRepository.delete({listId})

    return true
  }

  async moveList(listId: number, boardId: number, movedListId: number) {
    const listAllFind = await this.listsRepository.find({
        where: { boardId },
        order: { order: "ASC"}
    });

    listAllFind.forEach(list => {
      list.order = LexoRank.parse(list.order.toString());
  });

    let newLexo: LexoRank;

    const findIndex = listAllFind.findIndex(el=>el.listId===movedListId);

    if (findIndex === listAllFind.length-1 ) {
        newLexo = listAllFind[findIndex].order.genNext();
    } 
    else if (movedListId === -1) { 
        newLexo = listAllFind[0].order.genPrev();
    } 
    else {
        newLexo = listAllFind[findIndex].order.between(listAllFind[findIndex + 1].order);
    }

    const data = await this.listsRepository.update({listId}, {order:newLexo.toString()})

    return data;
  }
}
