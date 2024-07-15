import { Injectable } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";


@Injectable()
export class notification {
    constructor(private readonly notificationGateway: NotificationsGateway) {}

    //카드 상태 변경
    async updateCondition(cardId: number, userId: number, updatedData: any) {
        // 카드 상태 변경

        //알림 전송
        this.notificationGateway.sendNotification(userId, '카드 상태가 변경되었습니다.')
    }

    //카드 댓글 추가
    async addComment(cardId: number, userId: number, comment: string){
        
    }
}