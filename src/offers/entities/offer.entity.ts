import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
