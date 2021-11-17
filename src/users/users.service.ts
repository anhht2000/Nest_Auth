import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
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
    console.log('tét', this.usersRepository);

    return this.usersRepository.findOne({
      select: ['username', 'password', 'isAdmin', 'roles', 'id'],
      where: {
        username,
      },
    });
  }

  async findAll(): Promise<User[]> {
    console.log('', __dirname);

    return this.usersRepository.find({
      select: ['username', 'password', 'isAdmin', 'roles', 'id'],
    });
  }
}
