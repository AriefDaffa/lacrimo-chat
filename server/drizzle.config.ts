import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export const credentials = {
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: Number(process.env.DB_PORT) || 0,
  ssl: process.env.DB_SSL_OPTION === 'true' || false,
};

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    ...credentials,
  },
});
