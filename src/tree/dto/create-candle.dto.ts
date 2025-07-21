import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCandleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  treeid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  wishes: string;
}
