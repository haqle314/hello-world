import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

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
    const jti = randomUUID();
    const refresh_token = this.jwtService.sign(
      {
        sub: username,
        scope: 'refresh',
        jti,
      },
      { secret: process.env.SECRET_KEY, expiresIn: '7d' },
    );
    await this.usersService.registerRefreshToken(username, jti);
    return {
      access_token: this.jwtService.sign(
        {
          sub: username,
        },
        {
          secret: process.env.SECRET_KEY,
        },
      ),
      refresh_token,
    };
  }

  async loginWithRefreshToken(username: string) {
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
