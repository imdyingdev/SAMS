const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1,
  connectionTimeoutMillis: 5000
});

module.exports = async (req, res) => {
  try {
    // Create announcements table if it doesn't exist
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
    
    // Check if we need to insert sample data
    const result = await pool.query('SELECT COUNT(*) as count FROM announcements');
    
    if (result.rows[0].count === '0') {
      // Insert sample data if table is empty
      const sampleAnnouncements = [
        {
          title: 'Welcome to AMPID ES',
          content: 'Welcome to AMPID Elementary School\'s online portal. Stay updated with the latest school announcements and news.'
        },
        {
          title: 'School Events',
          content: 'Check back regularly for updates on upcoming school events, activities, and important dates.'
        },
        {
          title: 'Stay Connected',
          content: 'We\'re committed to keeping parents and students informed. This announcement system will help us stay connected.'
        }
      ];
      
      for (const announcement of sampleAnnouncements) {
        await pool.query(
          'INSERT INTO announcements (title, content) VALUES ($1, $2)',
          [announcement.title, announcement.content]
        );
      }
      
      res.status(200).json({ 
        message: 'Database initialized with sample data',
        announcements_created: sampleAnnouncements.length
      });
    } else {
      res.status(200).json({ 
        message: 'Database already initialized',
        announcements_count: parseInt(result.rows[0].count)
      });
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    res.status(500).json({ 
      error: 'Failed to initialize database',
      message: err.message
    });
  }
};
