console.log('TEST: Script is being executed');
console.log('TEST: Current directory:', process.cwd());
console.log('TEST: Script path:', import.meta.url);

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log('TEST: Modules imported successfully');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('TEST: Looking for .env file...');
const possibleEnvPaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../../../.env'),
];

let envPath = null;
for (const testPath of possibleEnvPaths) {
  console.log('TEST: Checking path:', testPath, 'exists:', fs.existsSync(testPath));
  if (fs.existsSync(testPath)) {
    envPath = testPath;
    console.log('TEST: Found .env at:', envPath);
    break;
  }
}

if (!envPath) {
  console.error('TEST: ERROR: .env file not found');
  process.exit(1);
}

dotenv.config({ path: envPath });
console.log('TEST: .env loaded');

const connectionString = process.env.DATABASE_URL;
console.log('TEST: DATABASE_URL found:', !!connectionString);

if (!connectionString) {
  console.error('TEST: ERROR: DATABASE_URL is not defined');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('TEST: Pool created');

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

console.log('TEST: About to test connection...');
try {
  const testResult = await query('SELECT NOW() as current_time');
  console.log('TEST: Database connection test successful:', testResult.rows[0].current_time);
} catch (error) {
  console.error('TEST: Database connection test failed:', error.message);
  process.exit(1);
}

console.log('TEST: Attempting to drop constraint...');
try {
  await query(`ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check`);
  console.log('TEST: Dropped existing constraint');
} catch (error) {
  console.error('TEST: ERROR dropping constraint:', error.message);
  console.error('TEST: Error code:', error.code);
  console.error('TEST: Error details:', error);
  process.exit(1);
}

console.log('TEST: Attempting to add constraint...');
try {
  await query(`
    ALTER TABLE students 
    ADD CONSTRAINT students_status_check 
    CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred'))
  `);
  console.log('TEST: Added enhanced status constraint');
} catch (error) {
  console.error('TEST: ERROR adding constraint:', error.message);
  console.error('TEST: Error code:', error.code);
  console.error('TEST: Error details:', error);
  process.exit(1);
}

console.log('TEST: All operations completed successfully');
process.exit(0);