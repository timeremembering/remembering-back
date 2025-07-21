import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AiGeneration {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'uuid' })
  @ApiProperty()
  userId: string;

  @Column({ default: 0 })
  @ApiProperty()
  count_of_generation: number;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
