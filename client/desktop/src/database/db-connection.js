import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

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
      console.log(`Testing database connection (attempt ${i + 1}/${retries})...`);
      
      const client = await pool.connect();
      
      // Test with a simple query
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('Database connected successfully!');
      console.log('Current time:', result.rows[0].current_time);
      console.log('PostgreSQL version:', result.rows[0].pg_version.split(' ')[0]);
      
      client.release();
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('All connection attempts failed. Please check:');
        console.error('1. Your internet connection');
        console.error('2. Database credentials in .env file');
        console.error('3. Supabase database status');
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
    const duration = Date.now() - start;
    
    console.log('Query executed successfully', { 
      duration: `${duration}ms`, 
      rows: result.rowCount,
      command: text.split(' ')[0]
    });
    
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

// Enhanced graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Closing database pool...');
  pool.end(() => {
    console.log('Database pool closed');
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Closing database pool...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

export { pool, query, testConnection };
