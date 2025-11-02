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
    // Create pool with minimal config
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 1,
      connectionTimeoutMillis: 10000
    });

    console.log('Attempting to connect to database...');
    
    // Try to create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by_username TEXT DEFAULT 'Admin'
      )
    `);
    
    console.log('Table check/creation successful');
    
    // Get count
    const result = await pool.query('SELECT COUNT(*) as count FROM announcements');
    const count = parseInt(result.rows[0].count);
    
    // If no announcements, insert test data
    if (count === 0) {
      await pool.query(
        'INSERT INTO announcements (title, content) VALUES ($1, $2)',
        ['Test Announcement', 'This is a test announcement from test-web']
      );
      
      const newResult = await pool.query('SELECT COUNT(*) as count FROM announcements');
      const newCount = parseInt(newResult.rows[0].count);
      
      return res.status(200).json({
        success: true,
        count: newCount,
        message: 'No announcements found, created test announcement',
        database: 'connected'
      });
    }
    
    res.status(200).json({
      success: true,
      count: count,
      message: `Found ${count} announcement(s)`,
      database: 'connected'
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      details: error.stack
    });
  } finally {
    // Always close the pool
    if (pool) {
      await pool.end();
    }
  }
};
