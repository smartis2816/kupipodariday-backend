import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1500)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsArray()
  itemsId: number[];
}
