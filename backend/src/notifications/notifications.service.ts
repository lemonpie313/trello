import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from './entity/notification.entity'
import { User } from "src/users/entity/users.entity";


@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    async createNotification(userId: number, message: string) {
        const user = await this.usersRepository.findOne({ where: { userId } }); // 유저 검색
        if (!user) {
          throw new Error('User not found');
        }
    
        const notification = this.notificationsRepository.create({
            user,
            message
        })
        return this.notificationsRepository.save(notification);
    }

    async getNotifications(userId: number) {
        const user = await this.usersRepository.findOne({ where: {userId}})
        if (!user) {
            throw new Error('User not found')
        }
        return this.notificationsRepository.find({
            where: {user},
            order: { createdAt: 'DESC'}
        })
    }
}