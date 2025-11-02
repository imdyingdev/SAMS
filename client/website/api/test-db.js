const { Pool } = require('pg');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'DATABASE_URL not configured',
      message: 'Environment variable DATABASE_URL is missing'
    });
  }

  let pool;

  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 1,
      connectionTimeoutMillis: 10000
    });
    
    console.log('Connected to database...');
    console.log('Getting announcement count...');
    const result = await pool.query('SELECT COUNT(*) as count FROM announcements');
    const count = parseInt(result.rows[0].count);
    
    res.status(200).json({
      success: true,
      database: 'connected',
      count: count,
      message: `Found ${count} announcement(s)`,
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        DATABASE_URL: 'configured'
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      details: error.stack
    });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};
