import { Injectable } from '@nestjs/common';
import { UsersService, User } from 'src/users/users.service';

@Injectable()
export class AdminService {

  constructor (private readonly usersService: UsersService) {}

  getUsers(): User[] {
    return this.usersService.getAll().map(user => {
      delete user.password;
      return user;
    });
  }

  updatePassword(userId: number, newPassword: string): User {
    let user = this.usersService.getById(userId);
    user.password = newPassword;
    user = this.usersService.update(user)
    delete user.password;
    return user;
  }
}
