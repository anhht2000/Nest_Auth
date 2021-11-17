import { Module } from '@nestjs/common';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // TypeOrmModule.forFeature([User], 'test'),
  ],
  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule {}
