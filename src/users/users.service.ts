import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.username === username);
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['username', 'password', 'isAdmin', 'roles', 'id'],
    });
  }
}
