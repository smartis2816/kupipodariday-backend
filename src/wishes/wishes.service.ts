import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { responseWishDto } from './selectors/responseWishDto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly UsersService: UsersService,
  ) {}
  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.UsersService.findById(userId);
    const wish = this.wishesRepository.create({ ...createWishDto, owner });
    return await this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find();
  }

  async findUserWishes(userId: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: {
        owner: { id: userId },
      },
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  private async findMany(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find(query);
  }

  findLast() {
    return this.findMany({
      select: responseWishDto,
      relations: ['owner'],
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  findTop() {
    return this.findMany({
      select: responseWishDto,
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }
    const { price } = updateWishDto;
    if (wish.raised > 0 && price != undefined) {
      throw new ConflictException(`You can't change price of a raised wish`);
    }
    if (wish.owner?.id !== userId || wish.offers.length) {
      throw new ForbiddenException(`You can't change price of this wish`);
    }
    return await this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }
    if (wish.owner.id != userId) {
      throw new ForbiddenException(`You can't remove this wish`);
    }
    return await this.wishesRepository.remove(wish);
  }

  async copyOne(wishId: number, userId: number) {
    const owner = await this.UsersService.findById(userId);
    if (!owner) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const sourceWish = await this.findOne(wishId);
    if (!sourceWish) {
      throw new NotFoundException(`Wish with id ${wishId} not found`);
    }
    const isExists = !!(await this.wishesRepository.findOne({
      where: {owner: {id: owner.id}, name: sourceWish.name},
    }));
    if (isExists) {
      throw new ConflictException(`Wish with name ${sourceWish.name} already exists`);
    }
    const newWish = this.wishesRepository.create({
      ...sourceWish,
      owner,
      copied: 0,
      raised: 0,
      offers: [],
    });
    sourceWish.copied++;
    await this.wishesRepository.save(sourceWish);
    return await this.wishesRepository.save(newWish);
  }
}
