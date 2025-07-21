import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTreeSlotCommentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment_title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment_text?: string;
}