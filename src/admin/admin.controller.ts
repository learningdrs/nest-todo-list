import { Controller, UseGuards, Request, BadRequestException, Get, Put } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminService } from './admin.service';
import { User } from 'src/users/users.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {

  constructor (private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(): User[] {
    return this.adminService.getUsers();
  }

  @Put('users/:userId/password')
  updatePassword(@Request() req): User {
    const userId = +req.params.userId;
    const { password, confirmation } = req.body;
    if (password !== confirmation) throw new BadRequestException();
    const user = this.adminService.updatePassword(userId, password);
    return user;
  }

}
