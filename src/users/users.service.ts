import { Injectable, ConflictException } from '@nestjs/common';

export type User = {
  userId: number,
  username: string,
  password: string,
  roles?: string[]
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

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async create(user: User): Promise<User> {
    const existsUser = await this.findOne(user.username);
    if (existsUser) throw new ConflictException();
    user.userId = this.currentId++;
    this.users.push(user);
    return user;
  }

}
