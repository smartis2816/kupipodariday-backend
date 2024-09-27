import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
