import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
  roles?: string[];
};

@Injectable()
export class UsersService {

  private readonly users: User[];

  private currentId = 4;

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        roles: ['admin']
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        roles: ['peasant']
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  findOne(username: string): User {
    const existsUser = this.users.find(user => user.username === username);
    return existsUser ? Object.assign({}, existsUser) : null;
  }

  create(user: User): User {
    const existsUser = this.findOne(user.username);
    if (existsUser) throw new ConflictException();
    user.userId = this.currentId++;
    this.users.push(user);
    return Object.assign({}, user);
  }

  update(user: User): User {
    const currentUser = this.users.find(entry => entry.username === user.username);
    if (!currentUser) throw new NotFoundException();
    this.users.splice(this.users.indexOf(currentUser), 1);
    this.users.push(user);
    return Object.assign({}, user);
  }

  updatePassword(username: string, password: any): User {
    const user = this.findOne(username);
    if (!user) throw new NotFoundException();
    user.password = password;
    return this.update(user);
  }

}
