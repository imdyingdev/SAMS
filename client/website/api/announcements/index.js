const { getPool } = require('../../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching all announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}