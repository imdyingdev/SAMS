import { query } from './db-connection.js';

// Get attendance records for a specific month, grade level, and section
async function getAttendanceForMonth(year, month, gradeLevel, section) {
  try {
    // Format month with leading zero if needed
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    
    // Calculate the actual last day of the month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${lastDayOfMonth.toString().padStart(2, '0')}`;
    
    // Get attendance from rfid_logs table
    const result = await query(`
      SELECT 
        s.id as student_id,
        s.first_name,
        s.last_name,
        gs.grade_level,
        gs.section_name as section,
        DATE(rl.timestamp) as date,
        rl.tap_type,
        rl.tap_count,
        rl.timestamp,
        CASE 
          WHEN rl.tap_type = 'time_in' THEN rl.timestamp
          ELSE NULL
        END as time_in,
        CASE 
          WHEN rl.tap_type = 'time_out' THEN rl.timestamp
          ELSE NULL
        END as time_out
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      LEFT JOIN rfid_logs rl ON s.rfid = rl.rfid
      WHERE gs.grade_level = $1 
        AND LOWER(REPLACE(gs.section_name, '.', '')) = LOWER(REPLACE($2, '.', ''))
        AND DATE(rl.timestamp) >= $3::date
        AND DATE(rl.timestamp) <= $4::date
      ORDER BY DATE(rl.timestamp) ASC, s.last_name ASC, s.first_name ASC
    `, [gradeLevel, section, startDate, endDate]);

    // Group by student and date to combine time_in and time_out
    const attendanceMap = {};
    result.rows.forEach(row => {
      const key = `${row.student_id}_${row.date}`;
      if (!attendanceMap[key]) {
        attendanceMap[key] = {
          student_id: row.student_id,
          date: row.date,
          time_in: null,
          time_out: null
        };
      }
      
      if (row.tap_type === 'time_in') {
        attendanceMap[key].time_in = row.timestamp;
      } else if (row.tap_type === 'time_out') {
        attendanceMap[key].time_out = row.timestamp;
      }
    });

    return Object.values(attendanceMap);
  } catch (error) {
    console.error('[ATTENDANCE] Error fetching attendance for month:', error.message);
    throw new Error(`Failed to fetch attendance for month: ${error.message}`);
  }
}

// Get attendance records for a specific student and month
async function getStudentAttendanceForMonth(studentId, year, month) {
  try {
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    
    // Calculate the actual last day of the month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${lastDayOfMonth.toString().padStart(2, '0')}`;
    
    const result = await query(`
      SELECT 
        id,
        student_id,
        date,
        time_in,
        time_out,
        status
      FROM attendance
      WHERE student_id = $1
        AND date >= $2
        AND date <= $3
      ORDER BY date ASC
    `, [studentId, startDate, endDate]);

    return result.rows;
  } catch (error) {
    console.error('[ATTENDANCE] Error fetching student attendance for month:', error.message);
    throw new Error(`Failed to fetch student attendance for month: ${error.message}`);
  }
}

// Check if a student has attendance record for a specific date
async function hasAttendanceForDate(studentId, date) {
  try {
    const result = await query(`
      SELECT 
        id,
        time_in,
        time_out,
        status
      FROM attendance
      WHERE student_id = $1 AND date = $2
      LIMIT 1
    `, [studentId, date]);

    if (result.rows.length === 0) {
      return null;
    }

    const record = result.rows[0];
    return {
      hasRecord: true,
      hasTimeIn: record.time_in !== null,
      hasTimeOut: record.time_out !== null,
      status: record.status
    };
  } catch (error) {
    console.error('[ATTENDANCE] Error checking attendance for date:', error.message);
    throw new Error(`Failed to check attendance for date: ${error.message}`);
  }
}

export {
  getAttendanceForMonth,
  getStudentAttendanceForMonth,
  hasAttendanceForDate
};
