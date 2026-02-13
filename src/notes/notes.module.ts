import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../models/note.entity';
import { NotesController } from './notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
