import { CanActivate } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { UsersService } from '../../users/users.service';
import { User } from 'src/users/entities/user.entity';

import { WS_ERRORS } from 'src/constants/ws-errors';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET) as any;
      return new Promise((resolve, reject) => {
        return this.userService
          .findOneBy(decoded.username)
          .then((user: User) => {
            if (user) {
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      if (ex instanceof jwt.TokenExpiredError) {
        console.log('Token expired');
        context.args[0].emit('error', {
          error: WS_ERRORS.TOKEN_EXPIRED,
          message:
            'Your token has expired, please login again. No updates will be applied.',
        });
        return false;
      }
      // JsonWebTokenError: jwt malformed
      if (ex instanceof jwt.JsonWebTokenError) {
        console.log('Token malformed');
        console.log(
          context.args[0].handshake.headers.authorization.split(' ')[1],
        );
        context.args[0].emit('error', {
          error: WS_ERRORS.TOKEN_MALFORMED,
          message:
            'Your token is malformed, please login again. No updates will be applied.',
        });
        return false;
      }
      context.args[0].emit('error', {
        error: WS_ERRORS.UNKNOWN,
        message: 'Unknown error occurred. No updates will be applied.',
      });
      return false;
    }
  }
}
