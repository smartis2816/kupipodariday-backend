import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compareHash } from '../helpers/hash';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });
    if (user && (await compareHash(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(user: User) {
    const { username, id } = user;
    return {
      access_token: this.jwtService.signAsync({ username, id }),
    };
  }
}
