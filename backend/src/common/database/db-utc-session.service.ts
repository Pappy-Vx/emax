import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

const SET_UTC = "SET time_zone = '+00:00'";

/**
 * Forces every MySQL connection to UTC. createdAt/updatedAt are stamped by MySQL's
 * CURRENT_TIMESTAMP, while app-written dates (periods, assignments) are UTC — on a host
 * whose MySQL runs in local time the two disagree and date comparisons break.
 */
@Injectable()
export class DbUtcSessionService implements OnModuleInit {
  private readonly logger = new Logger(DbUtcSessionService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const pool = (this.dataSource.driver as any).pool;
    if (!pool) return;

    pool.on('connection', (conn: any) => {
      conn.query(SET_UTC, (err: Error | null) => {
        if (err) this.logger.error(`Could not set MySQL session time zone: ${err.message}`);
      });
    });

    // The pool already holds the connection TypeORM opened at startup; fix that one too.
    await new Promise<void>((resolve) => {
      pool.getConnection((err: Error | null, conn: any) => {
        if (err) {
          this.logger.error(`Could not set MySQL session time zone: ${err.message}`);
          return resolve();
        }
        conn.query(SET_UTC, (qErr: Error | null) => {
          conn.release();
          if (qErr) this.logger.error(`Could not set MySQL session time zone: ${qErr.message}`);
          else this.logger.log('MySQL session time zone set to UTC');
          resolve();
        });
      });
    });
  }
}
