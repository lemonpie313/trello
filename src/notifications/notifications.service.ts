import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from './entity/notification.entity'


@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
    ){}

    async createNotification(userId: number, message: string) {
        const notification = this.notificationsRepository.create({
            userId,
            message
        })
        return this.notificationsRepository.save(notification);
    }

    async getNotifications(userId: number) {
        return this.notificationsRepository.find({
            where: {userId},
            order: { createdAt: 'DESC'}
        })
    }

    async readNotification(notificationId: number){
        const notification = await this.notificationsRepository.findOne({where: {notificationId}})
        if(notification) {
            notification.isRead = true;
            return this.notificationsRepository.save(notification)
        }
        return null;
    }
}