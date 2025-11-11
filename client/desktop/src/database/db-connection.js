import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the app root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths for .env file (dev vs production)
const possibleEnvPaths = [
  path.join(process.cwd(), '.env'),                    // Current working directory
  path.join(__dirname, '../../.env'),                  // From src/database to root (dev)
];

// Add production paths only if process.resourcesPath is defined (Electron environment)
if (process.resourcesPath) {
  possibleEnvPaths.push(
    path.join(process.resourcesPath, '.env'),          // Production: resources folder
    path.join(process.resourcesPath, '../.env')        // Production: one level up
  );
}

console.log('[DB] Searching for .env file...');
let envPath = null;
for (const testPath of possibleEnvPaths) {
  if (fs.existsSync(testPath)) {
    envPath = testPath;
    console.log('[DB] Found .env at:', envPath);
    break;
  }
}

if (!envPath) {
  console.error('[DB] WARNING: .env file not found in any expected location');
  console.error('[DB] Searched paths:', possibleEnvPaths);
}

// Suppress dotenv verbose output
const originalLog = console.log;
console.log = () => {};
dotenv.config({ path: envPath });
console.log = originalLog;

// Conditionally apply SSL configuration
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

// Debug logging for production builds
if (!connectionString) {
  console.error('[DB] ERROR: DATABASE_URL is not defined!');
  console.error('[DB] Current working directory:', process.cwd());
  console.error('[DB] NODE_ENV:', process.env.NODE_ENV);
} else {
  console.log('[DB] Database connection configured');
}

const poolConfig = {
  connectionString,
  timezone: 'Asia/Manila',
};

// Only add SSL configuration for non-local connections or in production
if (isProduction || (connectionString && !connectionString.includes('localhost'))) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// Enhanced connection test with retry logic
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      
      // Test with a simple query
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('[DATABASE] Connection established');
      
      client.release();
      return true;
    } catch (error) {
      if (i === retries - 1) {
        console.error('[DATABASE] Connection failed -', error.message);
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
}

// Generic query function with better error handling
async function query(text, params) {
  const start = Date.now();
  let client;
  
  try {
    client = await pool.connect();
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end();
});

process.on('SIGINT', () => {
  pool.end(() => {
    process.exit(0);
  });
});

export { pool, query, testConnection };
