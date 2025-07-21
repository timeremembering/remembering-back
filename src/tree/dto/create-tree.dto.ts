import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTreeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  tree_type_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  date_of_birth: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  date_of_dead: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;
}
