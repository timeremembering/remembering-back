import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReferralDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  referrerId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  referredId: string;
}
