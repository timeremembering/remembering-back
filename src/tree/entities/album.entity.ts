import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ required: true })
  treeid: string;

  @Column({ type: 'int', nullable: false, default: null })
  @ApiProperty({ required: true })
  index: number;

  @Column({ nullable: true, default: null })
  @ApiProperty({ required: false })
  album_title: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
