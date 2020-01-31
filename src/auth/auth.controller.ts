import { Controller, UseGuards, Post, Request, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('password/update')
  async updatePassword(@Request() req) {
    const { username, password, confirmation } = req.body;
    if (password !== confirmation) throw new BadRequestException();
    const user = await this.authService.updatePassword(username, password);
    return this.authService.login(user);
  }

}
