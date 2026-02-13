/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  Body,
  UseGuards,
  Render,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { NotesService } from './notes.service';
import { AuthGuard } from '../common/auth.guard';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // LIST ALL NOTES USER LOGIN
  @UseGuards(AuthGuard)
  @Get()
  @Render('notes/index')
  async index(@Req() req: RequestWithUser) {
    const user = req.user;
    const notes = await this.notesService.getNotesByUserId(user!);
    return { title: 'My Notes', notes, user };
  }

  // FORM CREATE NOTE
  @UseGuards(AuthGuard)
  @Get('create')
  @Render('notes/create')
  createForm(@Req() req: RequestWithUser) {
    return { title: 'Create Note', user: req.user || null };
  }

  // HANDLE CREATE NOTE
  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user;
    const { title, content } = body;
    await this.notesService.createNote(user!, title, content);
    res.redirect('/notes');
  }

  // FORM EDIT NOTE
  @UseGuards(AuthGuard)
  @Get('edit/:id')
  @Render('notes/edit')
  async editForm(@Param('id') id: string, @Req() req: RequestWithUser) {
    const note = await this.notesService.getNoteById(Number(id));
    if (!note) return { note: null, user: null, success: null, error: null };
    return { title: 'Edit Note', note, user: req.user };
  }

  // HANDLE UPDATE NOTE
  @UseGuards(AuthGuard)
  @Post('edit/:id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const { title, content } = body;
    await this.notesService.updateNote(Number(id), title, content);
    res.redirect('/notes');
  }

  @UseGuards(AuthGuard)
  @Get('detail/:id')
  @Render('notes/detail')
  async detail(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const noteId = parseInt(id, 10);
    const userId = req.user?.id;
    const note = await this.notesService.getNoteById(noteId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    // hanya owner yang bisa lihat
    if (note.user.id !== userId) {
      return res.redirect(
        '/notes?error=' +
          encodeURIComponent('You are not allowed to view this note'),
      );
    }

    return { note, user: req.user, title: 'Note Detail' };
  }

  // DELETE NOTE
  @UseGuards(AuthGuard)
  @Post('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.notesService.deleteNote(Number(id));
    res.redirect('/notes');
  }
}
