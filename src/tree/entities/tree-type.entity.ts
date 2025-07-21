import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tree } from './tree.entity';
import { TreeTypePrice } from './tree-type-price.entity';

@Entity()
export class TreeType {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @OneToMany(() => TreeTypePrice, (price) => price.tree_type)
  @JoinColumn()
  price_list: TreeTypePrice[];

  @Column()
  @ApiProperty()
  photo_limit: number;

  @Column()
  @ApiProperty()
  video_limit: number;

  @Column()
  @ApiProperty()
  audio_limit: number;

  @OneToMany(() => Tree, (tree) => tree.type)
  @JoinColumn()
  trees: Tree[];

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
