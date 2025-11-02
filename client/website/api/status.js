module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  res.status(200).json({
    status: 'ok',
    message: 'SAMS Website API is running',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'missing'
    },
    endpoints: [
      '/api/status',
      '/api/announcements',
      '/api/announcements/latest',
      '/api/announcements/[id]'
    ]
  });
};
