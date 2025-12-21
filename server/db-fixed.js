import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema.js';

// Parse DATABASE_URL manually if needed
let connectionConfig;
if (process.env.DATABASE_URL) {
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
  };
} else {
  // Fallback to individual env vars
  connectionConfig = {
    host: 'localhost',
    port: 5432,
    database: 'fuelfriendly',
    user: 'fuelfriendly',
    password: 'fuelfriendly123',
  };
}

const pool = new Pool(connectionConfig);

export const db = drizzle(pool, { schema });