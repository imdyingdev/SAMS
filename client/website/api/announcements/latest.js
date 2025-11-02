const { Pool } = require('pg');

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1,
  connectionTimeoutMillis: 5000
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching latest announcements...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3'
    );
    
    console.log('Found announcements:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching latest announcements:', err);
    res.status(500).json({ 
      error: 'Failed to fetch announcements',
      message: err.message
    });
  }
};
