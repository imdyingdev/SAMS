require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
// Import and mount API routes
app.get('/api/announcements-latest', async (req, res) => {
    // Import the handler function
    const handler = require('./api/announcements-latest');
    await handler(req, res);
});

// Fallback to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`\n📢 Announcements API: http://localhost:${PORT}/api/announcements-latest`);
    console.log(`\n Press Ctrl+C to stop the server\n`);
});
