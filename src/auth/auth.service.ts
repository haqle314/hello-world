import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (user && (await bcrypt.compare(password, user.hash))) {
      return user.username;
    }
    return null;
  }

  async signUp(username: string, password: string): Promise<any> {
    return this.usersService.signUp(username, password);
  }

  async login(username: string) {
    return {
      access_token: this.jwtService.sign(
        {
          sub: username,
        },
        {
          secret: process.env.SECRET_KEY,
        },
      ),
    };
  }
}
