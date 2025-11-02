const { getPool, initializeDatabase } = require('../../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const pool = getPool();
    
    // Initialize database if needed
    await initializeDatabase();
    
    const result = await pool.query(
      'SELECT * FROM announcements WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching announcement by ID:', err);
    res.status(500).json({ 
      error: 'Failed to fetch announcement',
      message: err.message
    });
  }
};
