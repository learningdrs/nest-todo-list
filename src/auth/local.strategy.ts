import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor (private readonly authService: AuthService) {
    super();
  }

  validate(username: string, password: string): User {

    const user = this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;

  }

}
