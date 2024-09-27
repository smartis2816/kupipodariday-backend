import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { use } from 'passport';
import { hashValue } from '../helpers/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: { username: name },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findMany(query: string) {
    try {
      return await this.usersRepository.find({
        where: [{ username: query }, { email: query }],
      });
    } catch (error) {
      throw new NotFoundException('Users not found');
    }
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
