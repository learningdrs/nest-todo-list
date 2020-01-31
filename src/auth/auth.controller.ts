import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, Token } from './auth.service';
import { User } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

  constructor (private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req): Token {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  register(@Request() req): Token {
    const user = this.authService.register(req.body as User);
    return this.authService.login(user);
  }

}
