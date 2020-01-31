import { Injectable } from '@nestjs/common';
import { UsersService, User } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'

export type Token = {
  token: string;
}

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  validateUser(username: string, pwd: string): User {
    const user = this.usersService.findOne(username);

    if (user && user.password === pwd) {

      delete user.password
      return user;

    }

    return null;
  }

  login(user: User): Token  {
    const payload = { username: user.username, sub: user.userId }

    return { token: this.jwtService.sign(payload) }

  }

  register(user: User): User {
    const createdUser = this.usersService.create(user);
    delete createdUser.password;
    return createdUser;
  }

}
