import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { StripeCurrencyEnum, TypeOfCasketEnum } from '../payment.types';

@Entity()
export class CasketPricing {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'enum', enum: TypeOfCasketEnum })
  @ApiProperty()
  type: TypeOfCasketEnum;

  @Column()
  @ApiProperty()
  price: number;

  @Column({ type: 'enum', enum: StripeCurrencyEnum })
  @ApiProperty()
  currency: StripeCurrencyEnum;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
