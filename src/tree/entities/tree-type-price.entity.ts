import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StripeCurrencyEnum } from '../../payment/payment.types';
import { TreeType } from './tree-type.entity';

@Entity()
export class TreeTypePrice {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'double precision' })
  @ApiProperty()
  price: number;

  @Column({ type: 'enum', enum: StripeCurrencyEnum })
  @ApiProperty({ type: 'enum', enum: StripeCurrencyEnum })
  currency: StripeCurrencyEnum;

  @ManyToOne(() => TreeType, { onDelete: 'CASCADE' })
  @JoinColumn()
  tree_type: TreeType;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
