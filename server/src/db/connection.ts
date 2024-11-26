import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { credentials } from '../../drizzle.config';
import { logger } from '../common/logger';

const pool = new Pool(credentials);

export const db = drizzle(pool, { logger });

async function main() {
  console.log('Starting migration...');
  await migrate(db, {
    migrationsFolder: 'drizzle',
  });

  console.log('Migration complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});
