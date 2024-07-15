import { WebSocketGateway,  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true})
export class NotificationsGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly notificationsService: NotificationsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
      console.log('WebSocket server initialized')
    }

    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('join')
    handleJoinRoom(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
      client.join(data.userId.toString());
      console.log(`Client ${client.id} joined room ${data.userId}`);
    }

    async sendNotification(userId: number, message: string) {
      console.log(`Sending notification to user ${userId}: ${message}`);
      this.server.to(userId.toString()).emit('notification', message);

      await this.notificationsService.createNotification(userId, message)
    }
  }
