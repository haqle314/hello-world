import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getUser(username: string) {
    return this.userModel.findOne({
      raw: true,
      where: { username },
    });
  }

  async registerRefreshToken(username: string, jti: string) {
    const user = await this.userModel.findOne({
      raw: true,
      attributes: ['refresh_tokens'],
      where: { username },
    });
    const refresh_tokens = user?.refresh_tokens ?? [];
    refresh_tokens?.push(jti);
    return this.userModel.update({ refresh_tokens }, { where: { username } });
  }

  async validateRefreshToken(username: string, jti: string) {
    const { refresh_tokens } =
      (await this.userModel.findOne({
        raw: true,
        attributes: ['refresh_tokens'],
        where: { username },
      })) || {};
    return refresh_tokens?.includes(jti);
  }

  async signUp(username: string, password: string) {
    if (await this.getUser(username)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.userModel.create({
        username,
        hash: await bcrypt.hash(password, 12),
      });
    }
  }
}
