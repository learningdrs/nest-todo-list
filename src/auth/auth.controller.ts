import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

  constructor (private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  async register(@Request() req) {
    const user = await this.authService.register(req.body as User);
    return this.authService.login(user);
  }

}
