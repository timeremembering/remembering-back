import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('candle')
export class Candle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ required: true })
  treeid: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ required: false })
  from: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ required: false })
  wishes: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
