// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   BadRequestException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { ListsService } from './lists.service';

// @Injectable()
// export class BoardIdInterceptor implements NestInterceptor {
//   constructor(private readonly listsService: ListsService) {}
//   // 보드 목록 조회에서는 ->
//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const { body, params } = request;

//     if (body.boardId) {
//       request.boardId = body.boardId;
//     } else if (body.listId) {
//     } else if (params.listId) {
//       const list = await this.listsService.findOne(params.listId);
//       if (!list) {
//         throw new BadRequestException('Invalid listId');
//       }
//       request.boardId = list.board.id;
//     } else {
//       throw new BadRequestException('boardId or listId is required');
//     }

//     return next.handle();
//   }
// }
