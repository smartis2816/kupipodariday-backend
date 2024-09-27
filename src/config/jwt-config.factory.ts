import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigFactory implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    const secretOrKey = this.configService.get<string>(process.env.JWT_SECRET);
    const expiresIn = this.configService.get<string>(
      process.env.JWT_TTL,
      process.env.JWT_EXPIRES_IN,
    );
    return {
      secret: secretOrKey,
      signOptions: { expiresIn: expiresIn },
    };
  }
}
