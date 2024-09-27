import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const items = await this.wishesRepository.find({
      where: { id: In(createWishlistDto.itemsId) },
    });
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });
    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You are not the owner of this wishlist');
    }
    return await this.wishlistRepository.save({
      ...wishlist,
      ...updateWishlistDto,
    });
  }

  async removeOne(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You are not the owner of this wishlist');
    }
    return await this.wishlistRepository.remove(wishlist);
  }
}
