import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export type ErrandStatus =
  | 'scheduled'
  | 'confirmed'
  | 'picked-up'
  | 'on-the-way'
  | 'completed'
  | 'cancelled';

@Entity('errands')
export class Errand extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  fromAddress: string;

  @Column({ type: 'varchar' })
  toAddress: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: ErrandStatus;

  @Column({ type: 'varchar', nullable: true })
  runnerName: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'tinyint', default: false })
  isRecurring: boolean;

  @Column({ type: 'varchar', nullable: true })
  recurringFrequency: string | null;

  @Column({ type: 'int', default: 20 })
  pointsAwarded: number;
}
