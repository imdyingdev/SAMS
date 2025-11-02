const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
<<<<<<< HEAD
      },
      // Serverless optimization
      max: 1,
      connectionTimeoutMillis: 5000
=======
      }
>>>>>>> origin/main
    });
  }
  return pool;
}

<<<<<<< HEAD
async function initializeDatabase() {
  const dbPool = getPool();
  
  try {
    // Create announcements table if it doesn't exist
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by_username TEXT DEFAULT 'Admin'
      )
    `);
    
    console.log('Announcements table created or already exists');
    
    // Check if we need to insert sample data
    const result = await dbPool.query('SELECT COUNT(*) as count FROM announcements');
    
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
        await dbPool.query(
          'INSERT INTO announcements (title, content) VALUES ($1, $2)',
          [announcement.title, announcement.content]
        );
      }
      
      console.log('Sample announcements inserted');
      return { initialized: true, announcements_created: sampleAnnouncements.length };
    }
    
    return { initialized: false, announcements_count: parseInt(result.rows[0].count) };
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

module.exports = { getPool, initializeDatabase };
=======
module.exports = { getPool };
>>>>>>> origin/main
