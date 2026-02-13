import { Controller, Get, Post, Body, Res, Render, Req } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET LOGIN PAGE
  @Get('login')
  @Render('auth/login')
  loginPage(@Req() req: RequestWithUser) {
    const user = req.user ?? null;
    return {
      title: 'Login Page',
      user,
    };
  }

  // POST LOGIN
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

    const result = await this.authService.login(email, password);

    // simpan JWT ke cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.redirect('/?login=success');
  }

  // Logout
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // clear cookie JWT
    res.clearCookie('access_token');

    return res.redirect('/login');
  }
}
