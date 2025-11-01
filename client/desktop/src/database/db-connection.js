import { Pool } from 'pg';
import dotenv from 'dotenv';

// Suppress dotenv verbose output
const originalLog = console.log;
console.log = () => {};
dotenv.config();
console.log = originalLog;

// Conditionally apply SSL configuration
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const poolConfig = {
  connectionString,
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
