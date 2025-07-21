import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TreeType } from '../../tree/entities/tree-type.entity';
import { LangEnum, TypeOfCasketEnum } from '../payment.types';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  fullName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  @ApiProperty()
  address: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  typeOfMail: string;

  @Column()
  @ApiProperty()
  addressIndex: string;

  @Column({ nullable: true })
  @ApiProperty()
  instructionsDelivery?: string;

  @Column({ nullable: true })
  @ApiProperty()
  hearAbout?: string;

  @Column({ type: 'enum', enum: TypeOfCasketEnum })
  @ApiProperty({ type: 'enum', enum: TypeOfCasketEnum })
  typeOfCasket: TypeOfCasketEnum;

  @Column()
  @ApiProperty()
  isCasketWithImage: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  engravingBoxes?: string;

  @Column()
  @ApiProperty()
  accountName: string;

  @Column({ nullable: true })
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  dob: string;

  @Column()
  @ApiProperty()
  dod: string;

  @Column({ nullable: false })
  @ApiProperty()
  phoneNumber: string;

  @Column({ nullable: true })
  @ApiProperty()
  specialWishes?: string;

  @Column({ default: false })
  @ApiProperty()
  is_finished: boolean;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  is_gift: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  giftFullName: string;

  @Column({ nullable: true })
  @ApiProperty()
  giftMiddleName?: string;

  @Column({ nullable: true })
  @ApiProperty()
  giftAddress: string;

  @Column({ type: 'enum', enum: LangEnum })
  @ApiProperty()
  language: LangEnum;

  @ManyToOne(() => TreeType)
  @JoinColumn()
  type: TreeType;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
