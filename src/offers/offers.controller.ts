import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/user.decorator';

@ApiBearerAuth()
@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
