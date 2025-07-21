import { ApiProperty } from '@nestjs/swagger';

import { StripeCurrencyEnum } from '../../payment/payment.types';

export class CreateTreeTypePriceDto {
  @ApiProperty()
  price: number;

  @ApiProperty({ type: 'enum', enum: StripeCurrencyEnum })
  currency: StripeCurrencyEnum;
}
