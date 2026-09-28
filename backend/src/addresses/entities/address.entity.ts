import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  label: string;

  @Column({ type: 'varchar' })
  line: string;

  @Column({ type: 'varchar', nullable: true })
  city: string | null;

  @Column({ type: 'varchar', nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zip: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ type: 'tinyint', default: false })
  isPrimary: boolean;
}
