import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

import { TreeFileType } from '../../tree/tree.types';
import { LangEnum } from '../payment.types';

export class CreatePaymentForSlotsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  treeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TreeFileType)
  file_type: TreeFileType;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LangEnum)
  language: LangEnum;
}
