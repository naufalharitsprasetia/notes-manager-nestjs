import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Response } from 'express';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@Injectable()
export class GuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    if (!request.user) {
      // belum login → biarkan akses
      return true;
    }

    // sudah login → redirect ke dashboard/home
    response.redirect(
      '/?error=' + encodeURIComponent('Forbidden: You must logout first'),
    );
    return false;
  }
}
