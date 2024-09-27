import { forwardRef, Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wishlist, Wish]),
    forwardRef(() => WishesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
