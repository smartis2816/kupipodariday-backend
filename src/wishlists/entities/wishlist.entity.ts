import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsUrl, Length, MaxLength } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsString()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
