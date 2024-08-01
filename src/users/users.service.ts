import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { JwtService } from '@nestjs/jwt';
import { validate as isUUID } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly CACHE_PREFIX = 'user:';
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll() {
    return `This action returns all users`;
  }

  async updateTime(user: UpdateUserDto) {
    user.last_login = new Date();
    return await this.userRepository.save(user);
  }

  async findOneBy(term: string) {
    const searchCriteria = isUUID(term) ? { id: term } : { username: term };

    const cacheKey = `${this.CACHE_PREFIX}${term}`;
    const cachedUser: User = await this.cacheManager.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: searchCriteria });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.cacheManager.set(cacheKey, user, 86400);
    return user;
  }

  async findOneByToken(token: string) {
    const decoded = this.decodeToken(token);
    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // Todo: Change this to a service if needed
  decodeToken(token: string): any {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch (error) {
      // Manejar errores de decodificación, por ejemplo, token inválido
      throw new Error('Invalid token');
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error. Please try again later.',
    );
  }
}
