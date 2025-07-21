import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TreeFileType } from '../tree.types';
import { Tree } from './tree.entity';

@Entity()
export class TreeSlot {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  index: number;

  @Column({ type: 'enum', enum: TreeFileType })
  @ApiProperty()
  slot_type: TreeFileType;

  @Column()
  @ApiProperty()
  link: string;

  @ManyToOne(() => Tree, { onDelete: 'CASCADE' })
  @JoinColumn()
  tree: Tree;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @Column({ nullable: true, default: null })
  @ApiProperty({ required: false })
  comment_title: string;

  @Column({ type: 'text', nullable: true, default: null })
  @ApiProperty({ required: false, type: 'string' })
  comment_text: string;
}
