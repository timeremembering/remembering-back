import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { AdditionalTreeSlots } from './additional-tree-slots.entity';
import { TreeSlot } from './tree-slot.entity';
import { TreeType } from './tree-type.entity';

@Entity()
export class Tree {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  first_name: string;

  @Column()
  @ApiProperty()
  last_name: string;

  @Column()
  @ApiProperty()
  full_name: string;

  @Column({ nullable: true })
  @ApiProperty()
  date_of_birth: string;

  @Column({ nullable: true })
  @ApiProperty()
  date_of_dead: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  avatar: string;

  @Column({ nullable: true })
  @ApiProperty()
  password: string;

  @Column({ default: 0 })
  @ApiProperty()
  available_slot: number;

  @OneToMany(
    () => AdditionalTreeSlots,
    (additional_slots) => additional_slots.tree,
  )
  @JoinColumn()
  additional_slots: AdditionalTreeSlots[];

  @OneToMany(() => TreeSlot, (treeSlot) => treeSlot.tree)
  @JoinColumn()
  slots: TreeSlot[];

  @ManyToOne(() => TreeType)
  @JoinColumn()
  type: TreeType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
