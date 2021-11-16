import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(test: any) {
    console.log('vao sẻvice');

    const payload = {
      username: test.username,
      sub: test.userId,
      roles: test.roles,
      isAdmin: test.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
