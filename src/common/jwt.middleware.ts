/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from './types/request-with-user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token;

    if (token) {
      try {
        // Verifikasi token dan simpan payload di req.user
        const payload: any = this.jwtService.verify(token);

        const user = await this.usersService.findById(payload.id);

        req.user = user ?? null;
      } catch (e) {
        console.error('JWT verify failed in middleware:', e);
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  }
}
