import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class AuthRegistrationDto {
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
  })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
  })
  plateName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Whether the user account is active (for admin use)',
  })
  isActive?: boolean;
}
