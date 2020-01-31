import { Injectable } from '@nestjs/common';
import { UsersService, User } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {

      const { password, ...result } = user;
      return result as User;

    }
    return null;
  }

}
