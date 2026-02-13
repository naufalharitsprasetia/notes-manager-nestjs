import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import type { RequestWithUser } from './common/types/request-with-user.interface';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  home(@Req() req: RequestWithUser, @Query('login') login?: string) {
    const user = req.user ?? null;
    const message = login === 'success' ? 'Login Berhasil' : null;
    return { title: 'Home', user, message };
  }
}
