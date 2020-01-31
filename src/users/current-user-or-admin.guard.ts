import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './users.service';

@Injectable()
export class CurrentUserOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const userId = +req.params.userId;

    return user.userId === userId || user.roles && user.roles.includes('admin');
  }
}
