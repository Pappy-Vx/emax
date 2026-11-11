import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete — 1 = deleted, 0 = active (default).
  // Never query without isDeleted: false; never call repo.remove() — use repo.update(id, { isDeleted: true }).
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
