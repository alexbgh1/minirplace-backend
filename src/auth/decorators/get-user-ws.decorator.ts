import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const WsGetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToWs().getData().user;
    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    console.log('WSGetUser:', user);

    return data ? user[data] : user;
  },
);
