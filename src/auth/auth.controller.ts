import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from 'src/user/dto/login.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    try {
      const user = await this.userService.findByLogin(loginDTO);
      const payload = {
        email: user.email,
      };
      const token = await this.authService.signPayload(payload);
      
      return { user, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
