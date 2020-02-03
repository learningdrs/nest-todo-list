import { Controller, UseGuards, Get, Request, BadRequestException, Put, Post, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UsersService, Todo } from './users.service';
import { CurrentUserOrAdminGuard } from './current-user-or-admin.guard';

/**
 * User related endpoints
 *
 * User routes can be accessed either by an admin or by the authenticated user
 * The CurrentUserOrAdminGuard imposes this rule
 */

@Controller('users')
@UseGuards(AuthGuard('jwt'), CurrentUserOrAdminGuard)
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers(): User[] {
    // CurrentUserOrAdmin ensures only admins can access this route
    // There's no userId param, so user.userId !== req.params.userId
    return this.usersService.getAll().map(user => {
      delete user.password;
      return user;
    });
  }

  @Post()
  createUser(@Request() req): User {
    // CurrentUserOrAdmin ensures only admins can access this route
    // There's no userId param, so user.userId !== req.params.userId
    const user = this.usersService.create(req.body);
    delete user.password;
    return user;
  }

  @Get(':userId')
  getUser(@Request() req): User {
    // Admins can get access to any user
    // Users can access their own information
    return this.usersService.getById(+req.params.userId || -1);
  }

  @Put(':userId/password')
  updateUserPassword(@Request() req): User {
    // Admins can update the password of any user
    // Users can update their own passwords
    let user = this.usersService.getById(+req.params.userId);
    const { password, confirmation } = req.body;
    if (password !== confirmation) throw new BadRequestException();

    user.password = password;
    user = this.usersService.update(user);
    delete user.password;
    return user;
  }

  @Get(':userId/todos')
  getAllTodos(@Request() req): Todo[] {
    const user = this.usersService.getById(+req.params.userId);
    return user.todos;
  }

  @Post(':userId/todos')
  createTodo(@Request() req): Todo {
    return this.usersService.addTodo(+req.params.userId, req.body);
  }

  @Get(':userId/todos/:todoId')
  getTodo(@Request() req): Todo {
    return this.usersService.getTodo(+req.params.userId, +req.params.todoId);
  }

  @Delete(':userId/todos/:todoId')
  removeTodo(@Request() req): Todo {
    return this.usersService.removeTodo(+req.params.userId, +req.params.todoId);
  }

}
