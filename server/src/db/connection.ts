import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { credentials } from '../../drizzle.config';
import { logger } from '../common/logger';

const pool = new Pool(credentials);

export const db = drizzle(pool, { logger });
