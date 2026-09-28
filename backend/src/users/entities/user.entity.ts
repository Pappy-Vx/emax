import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export type UserRole = 'customer' | 'runner' | 'admin';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 20, default: 'customer' })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  planId: string | null;

  @Column({ type: 'varchar', nullable: true })
  referralCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  referredBy: string | null;

  @Column({ type: 'int', default: 0 })
  hivePoints: number;

  @Column({ type: 'tinyint', default: false })
  isVerified: boolean;

  @Column({ type: 'tinyint', default: false })
  twoFaEnabled: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true })
  otpHash: string | null;

  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  googleId: string | null;

  @Column({ type: 'tinyint', default: false })
  isGoogleAuth: boolean;
}
