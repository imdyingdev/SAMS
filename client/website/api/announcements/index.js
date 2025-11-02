<<<<<<< HEAD
const { getPool, initializeDatabase } = require('../../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
=======
const { getPool } = require('../../lib/db');

export default async function handler(req, res) {
>>>>>>> origin/main
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
<<<<<<< HEAD
    
    // Initialize database if needed
    await initializeDatabase();
    
=======
>>>>>>> origin/main
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching all announcements:', err);
<<<<<<< HEAD
    res.status(500).json({ 
      error: 'Failed to fetch announcements',
      message: err.message
    });
  }
};
=======
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
>>>>>>> origin/main
