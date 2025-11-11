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

/**
 * Get weekly attendance statistics for weekdays only
 * @returns {Promise<Object>} The attendance statistics for the past 5 weekdays
 */
export async function getWeeklyAttendanceStats() {
  try {
    // Query to get daily attendance counts for weekdays only (exclude Sat & Sun)
    const weeklyQuery = `
      WITH date_series AS (
        SELECT 
          generate_series(
            (NOW() AT TIME ZONE 'Asia/Manila')::date - INTERVAL '6 days',
            (NOW() AT TIME ZONE 'Asia/Manila')::date,
            '1 day'::interval
          )::date AS date
      ),
      daily_counts AS (
        SELECT 
          (timestamp AT TIME ZONE 'Asia/Manila')::date AS date,
          COUNT(*) as attendance_count
        FROM rfid_logs
        WHERE tap_type = 'time_in'
        AND (timestamp AT TIME ZONE 'Asia/Manila')::date >= (NOW() AT TIME ZONE 'Asia/Manila')::date - INTERVAL '6 days'
        GROUP BY (timestamp AT TIME ZONE 'Asia/Manila')::date
      )
      SELECT 
        ds.date,
        TO_CHAR(ds.date, 'Dy') as day_name,
        COALESCE(dc.attendance_count, 0) as count
      FROM date_series ds
      LEFT JOIN daily_counts dc ON ds.date = dc.date
      WHERE EXTRACT(DOW FROM ds.date) NOT IN (0, 6)
      ORDER BY ds.date ASC
    `;
    
    const result = await query(weeklyQuery);
    
    // Format the data for the chart
    const labels = result.rows.map(row => row.day_name);
    const data = result.rows.map(row => parseInt(row.count));
    
    return {
      success: true,
      labels,
      data,
      totalAttendance: data.reduce((sum, count) => sum + count, 0)
    };
  } catch (error) {
    console.error('Error in getWeeklyAttendanceStats:', error.message);
    return {
      success: false,
      error: 'Failed to get weekly attendance statistics.',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      data: [0, 0, 0, 0, 0]
    };
  }
}
