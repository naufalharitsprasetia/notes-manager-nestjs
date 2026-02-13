import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import type { RequestWithUser } from './common/types/request-with-user.interface';
import { NotesService } from './notes/notes.service';
import { Note } from './models/note.entity';

@Controller()
export class AppController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @Render('home')
  async home(
    @Req() req: RequestWithUser,
    @Query('q') query?: string,
    @Query('login') login?: string,
    @Query('success') success?: string,
    @Query('error') error?: string,
  ) {
    const user = req.user ?? null;
    const message = login === 'success' ? 'Login Berhasil' : null;
    const err = error ? decodeURIComponent(error) : null;
    let notes: Note[];

    if (query) {
      // search notes berdasarkan keyword
      notes = await this.notesService.searchNotes(user!.id, query);
    } else {
      // ambil semua notes user
      notes = await this.notesService.getNotesByUserId(user!);
    }

    return { title: 'Home', user, message, err, success, notes, query };
  }
}
