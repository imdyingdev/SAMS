import { query } from './db-connection.js';

/**
 * Get today's attendance statistics
 * @returns {Promise<Object>} The attendance statistics for today
 */
export async function getTodayAttendanceStats() {
  try {
    // Query to get time in count for today (using Philippines timezone)
    const timeInQuery = `
      SELECT COUNT(*) as time_in_count
      FROM rfid_logs
      WHERE tap_type = 'time_in'
      AND (timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila')::date
    `;

    // Query to get time out count for today (using Philippines timezone)
    const timeOutQuery = `
      SELECT COUNT(*) as time_out_count
      FROM rfid_logs
      WHERE tap_type = 'time_out'
      AND (timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila')::date
    `;
    
    // Execute both queries
    const timeInResult = await query(timeInQuery);
    const timeOutResult = await query(timeOutQuery);
    
    // Extract the counts
    const timeIn = parseInt(timeInResult.rows[0]?.time_in_count || 0);
    const timeOut = parseInt(timeOutResult.rows[0]?.time_out_count || 0);
    
    return { 
      success: true, 
      data: {
        timeIn,
        timeOut
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
