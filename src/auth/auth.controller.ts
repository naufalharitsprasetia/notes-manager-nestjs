import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Render,
  Req,
  UnauthorizedException,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type { RequestWithUser } from '../common/types/request-with-user.interface';
import { GuestGuard } from '../common/guest.guard';
import { AuthGuard } from '../common/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET LOGIN PAGE
  @UseGuards(GuestGuard)
  @Get('login')
  @Render('auth/login')
  loginPage(
    @Req() req: RequestWithUser,
    @Query('error') error?: string,
    @Query('success') success?: string,
  ) {
    const user = req.user ?? null;
    return {
      title: 'Login Page',
      user,
      error: error || null,
      success: success || null,
    };
  }

  // POST LOGIN
  @UseGuards(GuestGuard)
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;
    try {
      const result = await this.authService.login(email, password);

      // simpan JWT ke cookie
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
      });

      return res.redirect('/?login=success');
    } catch (error) {
      // login gagal → redirect balik ke login dengan pesan error
      let message = 'Something went wrong';
      if (error instanceof UnauthorizedException) {
        message = error.message; // "User Not Found" / "Email atau Password salah"
      }

      // encode message supaya aman di URL
      return res.redirect('/login?error=' + encodeURIComponent(message));
    }
  }

  // Logout
  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // clear cookie JWT
    res.clearCookie('access_token');

    return res.redirect('/login?success=logout%20berhasil');
  }
}
