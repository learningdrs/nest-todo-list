import { Injectable } from '@nestjs/common';
import { UsersService, User } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {

      const { password, ...result } = user;
      return result as User;

    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.userId }

    return { token: this.jwtService.sign(payload) }

  }

  async register(user: User): Promise<User> {
    const { password, ...result } = await this.usersService.create(user);
    return result as User;
  }

}
