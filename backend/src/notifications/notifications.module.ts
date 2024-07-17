import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationController } from './notifications.controller';
import { Notification } from './entity/notification.entity';
import { User } from 'src/users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationController],
  exports: [NotificationsService,NotificationsGateway],
})
export class NotificationsModule {}
