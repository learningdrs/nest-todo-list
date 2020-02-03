import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

export type Todo = {
  id: number;
  title: string;
  body: string;
}

export type User = {
  userId: number;
  username: string;
  password: string;
  roles: string[];
  todos: Todo[];
};

@Injectable()
export class UsersService {

  private readonly users: User[];

  private currentUserId = 4;

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        roles: ['admin'],
        todos: []
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        roles: ['peasant'],
        todos: []
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
        roles: [],
        todos: []
      },
    ];
  }

  getAll(): User[] {
    return this.users.map(user => {
      user = Object.assign({}, user);
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
    user.userId = this.currentUserId++;
    this.users.push(user);
    return Object.assign({}, user);
  }

  update(user: User): User {
    const index = this.users.findIndex(entry => entry.userId === user.userId);
    this.users.splice(index, 1);
    this.users.push(user);
    return Object.assign({}, user);
  }

  addTodo(userId: number, todo: Todo): Todo {
    const user = this.getById(userId);

    let maxId = -1;
    user.todos.forEach(entry => {
      if (entry.id > maxId) maxId = entry.id;
    });

    todo.id = ++maxId;

    user.todos.push(todo);
    this.update(user);
    return todo;
  }

  getTodo(userId: number, todoId: number): Todo {
    const user = this.getById(userId);
    const todo = user.todos.find(entry => entry.id === todoId);
    if (!todo) throw new NotFoundException();
    return todo;
  }

  removeTodo(userId: number, todoId: number): Todo {
    const user = this.getById(userId);
    const todo = user.todos.find(entry => entry.id = todoId);
    if (!todo) throw new NotFoundException();
    user.todos = user.todos.filter(entry => entry.id !== todoId);
    this.update(user);
    return todo;
  }

}
