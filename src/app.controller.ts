import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import type { RequestWithUser } from './common/types/request-with-user.interface';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  home(
    @Req() req: RequestWithUser,
    @Query('login') login?: string,
    @Query('success') success?: string,
    @Query('error') error?: string,
  ) {
    const user = req.user ?? null;
    const message = login === 'success' ? 'Login Berhasil' : null;
    const err = error ? decodeURIComponent(error) : null;
    return { title: 'Home', user, message, err, success };
  }
}
