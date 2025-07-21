import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  import { User } from '../../user/entities/user.entity';
  
  @Entity('tokens')
  export class Tokens {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    refreshToken: string;
  
    @Column()
    accessToken: string;
  
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
  }