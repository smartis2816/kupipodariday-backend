import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
