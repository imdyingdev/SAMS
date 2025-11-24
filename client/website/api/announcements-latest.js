const { Pool } = require('pg');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return res.status(500).json({ 
      error: 'Database configuration error',
      message: 'DATABASE_URL environment variable is missing. Please configure it in Vercel environment variables.'
    });
  }

  let pool;

  try {
    // Create pool with serverless-optimized settings
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.DATABASE_URL.includes('ssl=true') ? {
        rejectUnauthorized: false
      } : false,
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    console.log('Fetching latest announcements...');
    
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3'
    );
    
    console.log('Found announcements:', result.rows.length);
    
    // Return empty array if no announcements instead of error
    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error('Error fetching latest announcements:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch announcements',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    // Properly close the pool for serverless functions
    if (pool) {
      try {
        await pool.end();
      } catch (closeErr) {
        console.error('Error closing pool:', closeErr);
      }
    }
  }
};
