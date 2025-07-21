import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCandleDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  wishes: string;
}
