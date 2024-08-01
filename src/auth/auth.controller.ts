import { Controller, Post, Body, Get, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe())
    loginUserDto: LoginUserDto,
  ) {
    const { username } = loginUserDto;
    return this.authService.login(username);
  }

  @Get('check-status')
  @Auth()
  async checkStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private-route')
  @Auth()
  async privateRoute() {
    // use data from the user object
    return 'This is a private route';
  }
}
