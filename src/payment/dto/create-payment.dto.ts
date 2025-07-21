import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateTransactionDto } from './create-transaction.dto';

export class CreatePaymentDto extends CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  type_id: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsEnum(StripeCurrencyEnum)
  // currency: StripeCurrencyEnum;
  //
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // first_name: string;
  //
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // last_name: string;
  //
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;
  //
  // @ApiProperty()
  // @IsOptional()
  // @IsPhoneNumber()
  // phone: string;
  //
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // special_message: string;
  // @ApiProperty()
  // @IsOptional()
  // @IsBoolean()
  // is_gift: boolean;
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // giftName: string;
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // giftLastName: string;
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // giftAddress: string;
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // language: LangEnum;
}
