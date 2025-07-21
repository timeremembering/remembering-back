import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true, enum: ROLE })
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  langue: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Whether the user account is active',
  })
  isActive?: boolean;
}
