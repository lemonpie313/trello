import { Injectable, BadRequestException } from '@nestjs/common';
import { LexoRank } from 'lexorank';

export class LexoService {
  items: { data: string; lexo: LexoRank }[] = [
    { data: 'item1', lexo: null },
    { data: 'item2', lexo: null },
    { data: 'item3', lexo: null },
    { data: 'item4', lexo: null },
    { data: 'item5', lexo: null },
    { data: 'item6', lexo: null },
    { data: 'item7', lexo: null },
  ];

  constructor() {
    let lexoRank = LexoRank.middle();
    this.items.map((item) => {
      item.lexo = lexoRank;
      lexoRank = lexoRank.genPrev();
    });
  }

  insert(data: string) {
    if (!data) {
      throw new BadRequestException('데이터가 필요합니다.');
    }

    let newLexo = LexoRank.middle();
    if (this.items.length > 0) {
      newLexo = this.items[this.items.length - 1].lexo.genNext();
    }

    this.items.push({ data, lexo: newLexo });
  }

  find() {
    const newItems = this.items
      .sort((a, b) => a.lexo.compareTo(b.lexo))
      .map((item) => ({
        data: item.data,
        lexo: item.lexo.toString(),
      }));

    return newItems;
  }

  move(id: number, where: number) {
    let newLexo: LexoRank;

    if (where >= this.items.length) {
      newLexo = this.items[this.items.length - 1].lexo.genNext();
    } else if (where <= 0) {
      newLexo = this.items[0].lexo.genPrev();
    } else {
      newLexo = this.items[where].lexo.between(this.items[where + 1].lexo);
    }

    this.items[id].lexo = newLexo;

    return true;
  }
}
