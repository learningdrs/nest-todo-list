import { Controller, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, Token } from 'src/auth/auth.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {

  constructor (private readonly authService: AuthService) {}

  @Post('users/:username/password')
  updatePassword(@Request() req): Token {
    const username = req.params.username;
    const { password, confirmation } = req.body;
    if (password !== confirmation) throw new BadRequestException();
    const user = this.authService.updatePassword(username, password);
    return this.authService.login(user);
  }

}
