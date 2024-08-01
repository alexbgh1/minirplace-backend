import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtPayload } from './interface/jwt-payload.interface';

import { User } from 'src/users/entities/user.entity';

import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<User | null> {
    return (await this.usersService.findOneBy(username)) || null;
  }

  async login(username: string) {
    const user = await this.usersService.findOneBy(username);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, last_login, created_at, ...userWithoutId } = user;

    // update user's last login time
    await this.usersService.updateTime(user);

    return { ...userWithoutId, token: this.getJwtToken({ id: user.id }) };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const { ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, last_login, created_at, ...userWithoutId } =
        await this.userRepository.save(user);

      return { ...userWithoutId, token: this.getJwtToken({ id: id }) };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const username = createUserDto.username;
    let user: CreateUserDto = await this.userRepository.findOneBy({
      username,
    });

    if (!user) {
      try {
        user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
      } catch (error) {
        this.handleDBException(error);
      }
    }
    return await this.usersService.updateTime(user);
  }

  private getJwtToken(payload: JwtPayload) {
    // payload is the data that will be stored in the token
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  private handleDBException(error: any): never {
    if (error.code === '23505') {
      // 23505 is unique_violation
      throw new BadRequestException('User already exists');
    }

    console.log(error);
    throw new InternalServerErrorException('Please check logs');
  }
}
