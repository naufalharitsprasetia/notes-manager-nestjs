import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return !!user && user.role === 'admin'; // hanya admin
  }
}
