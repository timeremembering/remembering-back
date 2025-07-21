import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TreeFileType } from '../tree.types';
import { Tree } from './tree.entity';

@Entity()
export class AdditionalTreeSlots {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'enum', enum: TreeFileType })
  @ApiProperty()
  file_type: TreeFileType;

  @Column({ default: 0 })
  @ApiProperty()
  count_of_slots: number;

  @ManyToOne(() => Tree, (tree) => tree.additional_slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tree: Tree;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
