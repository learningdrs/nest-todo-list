import { Controller, UseGuards, Get, Request, Post, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req): User {
    return req.user as User;
  }

  @Post('password')
  updatePassword(@Request() req): User {
    let currentUser: User = req.user;
    const { password, confirmation } = req.body;
    if (password !== confirmation) throw new BadRequestException();

    currentUser.password = password;
    currentUser = this.usersService.update(currentUser);
    delete currentUser.password;
    return currentUser;
  }

}
