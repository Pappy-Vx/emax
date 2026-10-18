/**
 * One-time seed script — creates the default admin and rider accounts.
 * Run once: npx ts-node -r tsconfig-paths/register src/seed-staff.ts
 *
 * Change passwords before deploying to production.
 */

import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const ds = new DataSource({
  type:        'mysql',
  host:        process.env.DB_HOST     ?? 'localhost',
  port:        Number(process.env.DB_PORT ?? 3306),
  database:    process.env.DB_NAME     ?? 'emax',
  username:    process.env.DB_USER     ?? 'root',
  password:    process.env.DB_PASSWORD ?? '',
  charset:     'utf8mb4',
  entities:    [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});

const STAFF = [
  {
    name:     'eMax Admin',
    email:    'ops@emaxerrands.com',
    password: 'AdminEmax2026!',
    role:     'admin',
  },
  {
    name:     'Test Rider',
    email:    'rider@emaxerrands.com',
    password: 'RiderEmax2026!',
    role:     'runner',
  },
];

async function seed() {
  await ds.initialize();
  const repo = ds.getRepository('users');

  for (const staff of STAFF) {
    const existing = await repo.findOneBy({ email: staff.email });
    if (existing) {
      console.log(`  skip  ${staff.email} — already exists`);
      continue;
    }
    const passwordHash = await bcrypt.hash(staff.password, 12);
    await repo.save(
      repo.create({
        name:         staff.name,
        email:        staff.email,
        passwordHash,
        role:         staff.role,
        isVerified:   true,
        twoFaEnabled: false,
      }),
    );
    console.log(`  created  ${staff.role}  ${staff.email}`);
  }

  await ds.destroy();
  console.log('\nDone.');
}

seed().catch((err) => { console.error(err); process.exit(1); });
