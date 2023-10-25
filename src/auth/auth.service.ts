import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/types/payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private readonly configService: ConfigService) {}

  async signPayload(payload: Payload) {
    return sign(payload, this.configService.get<string>('SECRET_KEY'), { expiresIn: '7d' });
  }
  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
