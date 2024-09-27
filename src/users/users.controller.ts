import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { User } from './entities/user.entity';
import { AuthUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private WishesService: WishesService,
  ) {}

  @Get('me')
  async getCurrentUser(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get('me/wishes')
  async getCurrentUserWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.WishesService.findUserWishes(user.id);
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<User> {
    return await this.usersService.findByName(username);
  }
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByName(username);
    return await this.WishesService.findUserWishes(user.id);
  }

  @Post('find')
  async findMany(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }

  @Patch('me')
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { password: _, ...currentUser } = await this.usersService.updateOne(
      user.id,
      updateUserDto,
    );
    return currentUser;
  }
}
