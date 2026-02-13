import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Render,
  Req,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express';
import type { CreateUserDto, UpdateUserDto } from './users.dto';
import type { RequestWithUser } from '../common/types/request-with-user.interface';
import { AuthGuard } from '../common/auth.guard';
import { GuestGuard } from '../common/guest.guard';
import { QueryFailedError } from 'typeorm';
import { UserValidationService } from './users.validation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GuestGuard)
  @Get('register')
  @Render('auth/register')
  showRegister(
    @Req() req: RequestWithUser,
    @Query('error') error?: string,
    @Query('success') success?: string,
  ) {
    return {
      title: 'Register Page',
      user: req.user || null,
      error: error || null,
      success: success || null,
    };
  }

  @UseGuards(GuestGuard)
  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    const errorMessage = UserValidationService.validateRegister(body);
    if (errorMessage) {
      return res.redirect(
        '/users/register?error=' + encodeURIComponent(errorMessage),
      );
    }
    try {
      await this.usersService.create(body);
      return res.redirect('/login?success=Registration%20successful');
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof QueryFailedError) {
        // menangani error dari database (misal: duplicate entry)
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return res.redirect(
        '/users/register?error=' + encodeURIComponent(message),
      );
    }
  }

  // Tampilkan halaman detail profile
  @UseGuards(AuthGuard)
  @Get('detail')
  @Render('users/detail')
  async detail(@Req() req: RequestWithUser) {
    if (!req.user) return { user: null }; // user belum login
    const user = await this.usersService.findById(req.user.id);

    return { title: 'Detail Profile Page', user };
  }

  // Tampilkan halaman edit profile
  @UseGuards(AuthGuard)
  @Get('edit')
  @Render('users/edit')
  async edit(
    @Req() req: RequestWithUser,
    @Query('success') success?: string,
    @Query('error') error?: string,
  ) {
    if (!req.user) return { user: null, success: null, error: null }; // user belum login
    const user = await this.usersService.findById(req.user.id);

    return { title: 'Edit Profile Page', user, success, error };
  }

  // Handle update profile
  @UseGuards(AuthGuard)
  @Post('edit')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/login');
    try {
      await this.usersService.updateUser(userId, updateDto);
      const message = 'Profile updated successfully';
      return res.redirect('/users/edit?success=' + message);
    } catch (error) {
      // login gagal → redirect balik ke login dengan pesan error
      let message = 'Something went wrong';
      if (error instanceof UnauthorizedException) {
        message = error.message; // login / password salah
      } else if (error instanceof QueryFailedError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      // encode message supaya aman di URL
      return res.redirect('/users/edit?error=' + encodeURIComponent(message));
    }
  }

  // Route untuk delete user
  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteAccount(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const userId = req.user?.id; // user id dari session/jwt
      if (!userId) {
        return res.status(401).send('Unauthorized');
      }

      await this.usersService.deleteUser(userId);

      // Logout user setelah delete akun
      res.clearCookie('connect.sid'); // hapus session cookie
      res.redirect('/?success=account%20deleted'); // redirect ke home
    } catch (error) {
      console.error(error);
      return res.status(500).send('Something went wrong');
    }
  }
}
