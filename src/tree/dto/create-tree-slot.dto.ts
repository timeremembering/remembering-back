import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { TreeFileType } from '../tree.types';

export class CreateTreeSlotDto {
  @ApiProperty()
  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  @IsNumber()
  index: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TreeFileType)
  slot_type: TreeFileType;

  @ApiProperty()
  albumTitle: string;
}

export class UpdateTreeSlotDto extends PartialType(CreateTreeSlotDto) {}
