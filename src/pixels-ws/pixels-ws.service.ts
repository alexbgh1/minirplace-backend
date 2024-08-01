import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { PixelService } from '../pixel/pixel.service';
import { UsersService } from 'src/users/users.service';

import { UpdatePixelsWDto } from './dto/update-pixels-w.dto';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class PixelsWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    private readonly userService: UsersService,
    private readonly pixelService: PixelService,
  ) {}

  async update(token: string, payload: UpdatePixelsWDto) {
    if (!token) throw new Error('User not found');
    if (!payload) throw new Error('Payload not found');

    // Find user
    const user = await this.userService.findOneByToken(token);
    const pixel = await this.pixelService.update(payload.id, user, payload);

    return pixel;
  }

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
    console.log('Client connected', client.id);
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients).length;
  }
}
