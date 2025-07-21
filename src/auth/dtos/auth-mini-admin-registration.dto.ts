import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class AuthMiniAdminRegistrationDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'John Dou',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'test@mail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEnum(ROLE)
  @IsOptional()
  role: ROLE;

  @ApiProperty({
    required: true,
    type: String,
    example: 'en',
  })
  @IsNotEmpty()
  @IsString()
  langue: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'code',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'test',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  plateName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Whether the mini-admin account is active (for admin use)',
  })
  isActive?: boolean;
}
