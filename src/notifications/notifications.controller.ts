import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";

@ApiTags('Notification API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    async getNotifications(@Request() req){
        console.log('req.user', req.user)
        const userId = req.user.userId
        const notifications = await this.notificationsService.getNotifications(userId)
        return notifications
    }

} 