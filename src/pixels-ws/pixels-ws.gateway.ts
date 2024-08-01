import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { PixelsWsService } from './pixels-ws.service';

import { WsGuard } from '../auth/decorators/auth-ws.decorator';

import { UpdatePixelsWDto } from './dto/update-pixels-w.dto';

@WebSocketGateway({ cors: true, namespace: '/' })
export class PixelsWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly pixelsWsService: PixelsWsService) {}

  @WebSocketServer() wss: Server;

  handleConnection(client: Socket) {
    this.pixelsWsService.registerClient(client);

    this.wss.emit(
      'update-users-length',
      this.pixelsWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.pixelsWsService.removeClient(client);
    this.wss.emit(
      'update-users-length',
      this.pixelsWsService.getConnectedClients(),
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('update-pixel')
  async onPixelUpdate(client: Socket, payload: UpdatePixelsWDto) {
    let auth_token = client.handshake.headers.authorization;
    const token = (auth_token = auth_token.split(' ')[1]);
    const pixel = await this.pixelsWsService.update(token, payload);
    this.wss.emit('update-pixel', pixel);
  }
}
