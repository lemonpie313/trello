import { WebSocketGateway,  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true})
export class NotificationsGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

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

    sendNotification(userId: number, message: string) {
      this.server.to(userId.toString()).emit('notification', message);
    }
  }
