// Database configuration and Supabase client initialization
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
}

// Initialize Supabase client with real-time enabled
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    }
);

// Test connection and log status
console.log('🔗 Supabase client initialized');
console.log('📡 Real-time enabled for database changes');

module.exports = {
    supabase
};
