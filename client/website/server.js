const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Serverless optimization
  max: 1,
  connectionTimeoutMillis: 5000
});

// Initialize database (only in development or on first deployment)
// In serverless, this runs on cold starts
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Create announcements table if it doesn't exist
    await client.query(`
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
    const result = await client.query('SELECT COUNT(*) as count FROM announcements');
    
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
        await client.query(
          'INSERT INTO announcements (title, content) VALUES ($1, $2)',
          [announcement.title, announcement.content]
        );
      }
      console.log('Sample announcements inserted');
    }
    
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Run initialization (safe for serverless - uses connection pooling)
initializeDatabase();

// Middleware
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
// Get latest 3 announcements
app.get('/api/announcements/latest', async (req, res) => {
  try {
    console.log('Fetching latest announcements...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3'
    );
    console.log('Found announcements:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching latest announcements:', err);
    res.status(500).json({ 
      error: 'Failed to fetch announcements',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Get a single announcement by ID
app.get('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM announcements WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching announcement by ID:', err);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Serving index.html as the main page`);
  });
}

// Export for Vercel serverless
module.exports = app;
