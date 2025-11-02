const { getPool, initializeDatabase } = require('../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    
    // Initialize database if needed (runs on cold starts)
    await initializeDatabase();
    
    console.log('Fetching latest announcements...');
    
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
