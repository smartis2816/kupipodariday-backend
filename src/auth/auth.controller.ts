import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@AuthUser() user, @Body() createAuthDto: CreateAuthDto): Promise<any> {
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createOne(createUserDto);
  }
}
