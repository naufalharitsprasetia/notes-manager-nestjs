import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({ ...data, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // edit profile
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    console.log(data);
    if (data.password == '') {
      // console.log(user);
      data.password = await bcrypt.hash(user.password, 10);
    } else if (data.password) {
      // hash password baru
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepo.delete({ id: userId });
  }
}
