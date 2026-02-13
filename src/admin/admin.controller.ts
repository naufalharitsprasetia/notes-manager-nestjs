/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Render,
  UseGuards,
  Res,
  Post,
  Param,
  Req,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotesService } from '../notes/notes.service';
import { AdminGuard } from '../common/admin.guard';
import type { Response } from 'express';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notesService: NotesService,
  ) {}

  @Get()
  @Render('admin/dashboard')
  async dashboard(@Req() req: RequestWithUser) {
    const users = await this.usersService.getAllUsers();
    const notes = await this.notesService.getAllNotes();
    return { users, notes, title: 'Admin Dashboard', user: req.user };
  }

  @Post('user/delete/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.deleteUser(parseInt(id, 10));
    return res.redirect('/admin');
  }
}
