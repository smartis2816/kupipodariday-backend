import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user,
  ) {
    return this.wishlistsService.updateOne(+id, updateWishlistDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @AuthUser() user) {
    return this.wishlistsService.removeOne(+id, user.id);
  }
}
