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

// Statuses during which the runner may share, and the customer may see, live location.
export const TRACKABLE_STATUSES: ErrandStatus[] = ['confirmed', 'picked-up', 'on-the-way'];

export const CLEARED_RUNNER_LOCATION = {
  runnerLat:        null,
  runnerLng:        null,
  runnerAccuracy:   null,
  runnerLocationAt: null,
};

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

  // 4-digit customer confirmation code — rider must enter this to complete the errand
  @Column({ type: 'varchar', length: 4, nullable: true })
  code: string | null;

  // Assigned runner (User with role='runner')
  @Column({ type: 'varchar', nullable: true })
  riderId: string | null;

  @Column({ type: 'datetime', nullable: true })
  riderAssignedAt: Date | null;

  // Rider-initiated cancellation request — must be approved by an admin
  @Column({ type: 'tinyint', default: false })
  cancellationRequested: boolean;

  @Column({ type: 'text', nullable: true })
  cancellationRequestReason: string | null;

  @Column({ type: 'datetime', nullable: true })
  cancellationRequestedAt: Date | null;

  // Runner's latest GPS fix — only kept while the errand is in progress, cleared when it ends.
  @Column({ type: 'double', nullable: true })
  runnerLat: number | null;

  @Column({ type: 'double', nullable: true })
  runnerLng: number | null;

  // Reported GPS accuracy radius in metres
  @Column({ type: 'int', nullable: true })
  runnerAccuracy: number | null;

  @Column({ type: 'datetime', nullable: true })
  runnerLocationAt: Date | null;
}
