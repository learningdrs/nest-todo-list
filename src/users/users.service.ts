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

  getAll(): User[] {
    return this.users.map(user => {
      user = Object.assign({}, user);
      delete user.password;
      return user;
    });
  }

  getById(userId: number): User {
    const users = this.users.filter(user => user.userId === userId);
    if (users.length === 0) throw new NotFoundException();
    return Object.assign({}, users[0]);
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
    const index = this.users.findIndex(entry => entry.userId === user.userId);
    this.users.splice(index, 1);
    this.users.push(user);
    return Object.assign({}, user);
  }

}
