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
  }
});

// Test database connection
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database');
    
    // Create announcements table if it doesn't exist
    client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by_username TEXT DEFAULT 'Admin'
      )
    `)
    .then(() => {
      console.log('Announcements table created or already exists');
      
      // Check if we need to insert sample data
      return client.query('SELECT COUNT(*) as count FROM announcements');
    })
    .then(result => {
      if (result.rows[0].count === '0') {
        // Insert sample data if table is empty
        const sampleAnnouncements = [
          {
            title: 'Welcome to SAMS',
            content: 'Welcome to the Student Attendance Management System. This system helps track student attendance efficiently.'
          },
          {
            title: 'System Maintenance',
            content: 'The system will be down for maintenance on Saturday from 10 PM to 2 AM.'
          },
          {
            title: 'New Feature: Announcements',
            content: 'We have added a new Announcements feature to keep everyone informed about important updates.'
          }
        ];
        
        const insertPromises = sampleAnnouncements.map(announcement => {
          return client.query(
            'INSERT INTO announcements (title, content) VALUES ($1, $2)',
            [announcement.title, announcement.content]
          );
        });
        
        return Promise.all(insertPromises);
      }
    })
    .then(() => {
      console.log('Sample announcements inserted or already exist');
      client.release();
    })
    .catch(err => {
      console.error('Error setting up database:', err);
      client.release();
    });
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

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
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching latest announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
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
