import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ROLE } from '../../auth/constants/role.constant';
import { Tree } from '../../tree/entities/tree.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  password: string;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  @ApiProperty()
  username: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  @ApiProperty()
  @IsEnum(ROLE, { message: 'Invalid entity type' })
  role: ROLE;

  @ApiProperty()
  @Column({ default: false })
  isAccountDisabled: boolean;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  @ApiProperty()
  email: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @ApiProperty()
  updatedAt: Date;

  @OneToMany(() => Tree, (tree) => tree.user)
  @JoinColumn()
  trees: Tree[];

  @Column({ length: 200 })
  @ApiProperty()
  langue: string;

  @Column({ length: 200, default: '' })
  @ApiProperty()
  code: string;

  @Column({ length: 200, default: '' })
  @ApiProperty()
  phone: string;

  @Column({ length: 200, default: '' })
  @ApiProperty()
  companyName: string;

  @Column({ length: 200, default: '' })
  @ApiProperty()
  resetPasswordToken: string;

  @Column({ length: 200, default: '' })
  @ApiProperty()
  plateName: string;

  @OneToMany(() => User, (user) => user.referredBy)
  @ApiProperty()
  referredUsers: User[];

  @ManyToOne(() => User, (user) => user.referredUsers, { nullable: true })
  @JoinColumn()
  @ApiProperty()
  referredBy: User;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  promotionImage: string;
}
