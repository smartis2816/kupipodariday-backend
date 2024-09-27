import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Get('/last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('/top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeOne(@Param('id') id: string, @AuthUser() user) {
    return this.wishesService.removeOne(+id, user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copyWish(@Param('id') id: string, @AuthUser() user) {
    return this.wishesService.copyOne(+id, user.id);
  }
}
