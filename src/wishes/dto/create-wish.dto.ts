import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}
