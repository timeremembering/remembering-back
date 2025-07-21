import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TreeFileType } from '../../tree/tree.types';
import { StripeCurrencyEnum } from '../payment.types';

@Entity()
export class AdditionalSlotsPricing {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'enum', enum: TreeFileType })
  @ApiProperty()
  file_type: TreeFileType;

  @Column({ type: 'enum', enum: StripeCurrencyEnum })
  @ApiProperty()
  currency: StripeCurrencyEnum;

  @Column()
  @ApiProperty()
  price: number;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
