import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userValidation = await this.authService.validateUser(
      username,
      password,
    );
    if (!userValidation) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return userValidation;
  }
}
