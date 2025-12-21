import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });