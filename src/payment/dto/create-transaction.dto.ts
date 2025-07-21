import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { LangEnum, TypeOfCasketEnum } from '../payment.types';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typeOfMail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressIndex: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  instructionsDelivery?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  hearAbout?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty({ message: 'validation.phoneNumber' })
  @IsString()
  @Matches(
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
    {
      message: 'validation.matches',
    },
  )
  @MinLength(9, { message: 'validation.phoneNumberMin' })
  @MaxLength(15, { message: 'validation.phoneNumberMax' })
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  specialWishes?: string;
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_gift: boolean;
  @ApiProperty()
  @IsOptional()
  @IsString()
  giftFullName: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  giftMiddleName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dod: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TypeOfCasketEnum)
  typeOfCasket: TypeOfCasketEnum;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withoutBox: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isCasketWithImage: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  giftAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  engravingBoxes?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LangEnum)
  language: LangEnum;
}
