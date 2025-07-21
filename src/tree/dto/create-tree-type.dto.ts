import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateTreeTypePriceDto } from './create-tree-type-price.dto';

export class CreateTreeTypeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateTreeTypePriceDto)
  // @ValidateNested()
  @IsArray()
  price_list: CreateTreeTypePriceDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  photo_limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  video_limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  audio_limit: number;
}
