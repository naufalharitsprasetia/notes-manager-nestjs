import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express';
import type { CreateUserDto, UpdateUserDto } from './users.dto';
import type { RequestWithUser } from '../common/types/request-with-user.interface';
import { AuthGuard } from '../common/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('register')
  @Render('auth/register')
  showRegister() {
    return {
      title: 'Register Page',
    };
  }

  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(body);
    return res.redirect('/users/register');
  }

  // Tampilkan halaman edit profile
  @Get('edit')
  @Render('users/edit')
  async edit(@Req() req: RequestWithUser) {
    if (!req.user) return { user: null }; // user belum login
    const user = await this.usersService.findById(req.user.id);

    return { title: 'Edit Profile Page', user };
  }

  // Handle update profile
  @Post('edit')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const userId = req.user?.id;
    console.log(req.user);
    if (!userId) return res.redirect('/login');

    await this.usersService.updateUser(userId, updateDto);
    return res.redirect('/users/edit');
  }

  // Route untuk delete user
  @UseGuards(AuthGuard) // pastikan user login
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
      res.redirect('/'); // redirect ke home
    } catch (error) {
      console.error(error);
      return res.status(500).send('Something went wrong');
    }
  }
}
