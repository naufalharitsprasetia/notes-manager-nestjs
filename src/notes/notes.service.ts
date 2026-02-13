import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../models/note.entity';
import { User } from '../models/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async createNote(user: User, title: string, content?: string): Promise<Note> {
    const note = this.noteRepository.create({ title, content, user });
    return this.noteRepository.save(note);
  }

  async searchNotes(userId: number, keyword: string): Promise<Note[]> {
    return this.noteRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .andWhere('(note.title LIKE :keyword OR note.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      })
      .orderBy('note.id', 'DESC')
      .getMany();
  }

  async getNotesByUserId(user: User): Promise<Note[]> {
    return this.noteRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'], // penting kalau pakai object
      order: { id: 'DESC' },
    });
  }

  async getNoteById(id: number): Promise<Note | null> {
    return this.noteRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async updateNote(
    id: number,
    title?: string,
    content?: string,
  ): Promise<Note> {
    const note = await this.getNoteById(id);
    if (!note) throw new Error('Note not found');

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    return this.noteRepository.save(note);
  }

  async deleteNote(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }
  async getAllNotes() {
    return this.noteRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}
