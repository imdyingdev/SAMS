// This file is kept for local development only
// Production uses Vercel's /api directory structure

const express = require('express');
const path = require('path');
const { getPool, initializeDatabase } = require('./lib/db');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Get shared database pool
const pool = getPool();

// Initialize database on startup (for local development)
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Failed to initialize database:', err);
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
