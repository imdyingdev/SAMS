import { query } from './db-connection.js';

/**
 * Get today's attendance statistics
 * @returns {Promise<Object>} The attendance statistics for today
 */
export async function getTodayAttendanceStats() {
  try {
    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Query to get time in count for today
    const timeInQuery = `
      SELECT COUNT(*) as time_in_count 
      FROM logs 
      WHERE log_type = 'time_in' 
      AND created_at::date = $1::date
    `;
    
    // Query to get time out count for today
    const timeOutQuery = `
      SELECT COUNT(*) as time_out_count 
      FROM logs 
      WHERE log_type = 'time_out' 
      AND created_at::date = $1::date
    `;
    
    // Execute both queries
    const timeInResult = await query(timeInQuery, [today]);
    const timeOutResult = await query(timeOutQuery, [today]);
    
    // Extract the counts
    const timeIn = parseInt(timeInResult.rows[0]?.time_in_count || 0);
    const timeOut = parseInt(timeOutResult.rows[0]?.time_out_count || 0);
    
    return { 
      success: true, 
      data: {
        timeIn,
        timeOut,
        date: today
      }
    };
  } catch (error) {
    console.error('Error in getTodayAttendanceStats:', error.message);
    return { 
      success: false, 
      error: 'Failed to get today\'s attendance statistics.' 
    };
  }
}
