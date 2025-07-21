import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty,IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;
}