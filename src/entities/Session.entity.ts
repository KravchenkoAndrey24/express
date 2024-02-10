import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionHash: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
