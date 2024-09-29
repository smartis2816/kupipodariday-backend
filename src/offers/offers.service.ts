import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, itemId } = createOfferDto;
    const item: Wish = await this.wishesRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Wish not found');
    }
    if (item.owner.id !== user.id) {
      throw new ForbiddenException("You can not offer for other user's wish");
    }
    const raised = item.raised + amount;
    if (raised >= item.price) {
      throw new ForbiddenException(
        'You can not offer more than the wish price',
      );
    }
    item.raised = raised;
    await this.wishesRepository.save(item);
    const offer = this.offersRepository.create({
      ...createOfferDto,
      item: item,
      user: user,
    });
    return await this.offersRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({ where: { id } });
  }

  async updateOne(id: number, updateOfferDto: UpdateOfferDto) {
    return await this.offersRepository.update(id, updateOfferDto);
  }

  async removeOne(id: number) {
    return await this.offersRepository.delete(id);
  }
}
