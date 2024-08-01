import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      //? Error 500 is used beacuse we assume that the user is always present if the request is valid
      return new InternalServerErrorException('User not found (request)');
    }
    if (!data) return user;

    return user[data];
  },
);
