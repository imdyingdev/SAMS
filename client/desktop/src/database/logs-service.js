import { pool } from './db-connection.js';

/**
 * Create a new log entry
 * @param {string} logType - Type of log (time_in, time_out, student_added, etc.)
 * @param {string} description - Description of the activity
 * @param {string} rfid - RFID tag (optional)
 * @param {number} studentId - Student ID (optional)
 * @param {string} details - Additional details (optional)
 * @returns {Promise<Object>} Result object
 */
export async function createLogEntry(logType, description, rfid = null, studentId = null, details = null) {
    try {
        const query = `
            INSERT INTO activity_logs (log_type, description, rfid, student_id, details, timestamp)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *
        `;
        
        const values = [logType, description, rfid, studentId, details];
        const result = await pool.query(query, values);
        
        return { success: true, log: result.rows[0] };
    } catch (error) {
        console.error('[LOGS] Error creating log entry:', error.message);
        throw new Error(`Failed to create log entry: ${error.message}`);
    }
}

/**
 * Get paginated logs with optional filtering from rfid_logs table
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of logs per page
 * @param {string} searchTerm - Search term for filtering
 * @param {string} logTypeFilter - Filter by log type (time_in, time_out)
 * @param {string} dateFilter - Filter by date range
 * @returns {Promise<Object>} Paginated logs result
 */
export async function getLogsPaginated(page = 1, pageSize = 50, searchTerm = '', logTypeFilter = '', dateFilter = '') {
    try {
        console.log('DEBUG: getLogsPaginated called with params:', {
            page, pageSize, searchTerm, logTypeFilter, dateFilter
        });

        const offset = (page - 1) * pageSize;

        // Build WHERE clause based on filters
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;
        
        // Search term filter
        if (searchTerm && searchTerm.trim() !== '') {
            whereConditions.push(`(
                rl.rfid ILIKE $${paramIndex} OR
                CONCAT(s.last_name, ', ', s.first_name) ILIKE $${paramIndex} OR
                s.lrn::text ILIKE $${paramIndex}
            )`);
            queryParams.push(`%${searchTerm.trim()}%`);
            paramIndex++;
        }
        
        // Log type filter
        if (logTypeFilter && logTypeFilter.trim() !== '') {
            whereConditions.push(`rl.tap_type = $${paramIndex}`);
            queryParams.push(logTypeFilter.trim());
            paramIndex++;
        }
        
        // Date filter
        if (dateFilter && dateFilter.trim() !== '') {
            let dateCondition = '';
            const filter = dateFilter.trim();
            
            switch (filter) {
                case 'today':
                    // Convert to Philippines timezone (UTC+8) for "today"
                    dateCondition = `(rl.timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila')::date`;
                    break;
                case 'yesterday':
                    // Convert to Philippines timezone (UTC+8) for "yesterday"
                    dateCondition = `(rl.timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila' - INTERVAL '1 day')::date`;
                    break;
                case 'week':
                    dateCondition = `rl.timestamp >= DATE_TRUNC('week', (NOW() AT TIME ZONE 'Asia/Manila')::date) AND rl.timestamp < DATE_TRUNC('week', (NOW() AT TIME ZONE 'Asia/Manila')::date) + INTERVAL '1 week'`;
                    break;
                case 'month':
                    dateCondition = `rl.timestamp >= DATE_TRUNC('month', (NOW() AT TIME ZONE 'Asia/Manila')::date) AND rl.timestamp < DATE_TRUNC('month', (NOW() AT TIME ZONE 'Asia/Manila')::date) + INTERVAL '1 month'`;
                    break;
                default:
                    // Check if it's a custom date in YYYY-MM-DD format
                    if (/^\d{4}-\d{2}-\d{2}$/.test(filter)) {
                        // Convert to Philippines timezone for custom date comparison
                        dateCondition = `(rl.timestamp AT TIME ZONE 'Asia/Manila')::date = $${paramIndex}::date`;
                        queryParams.push(filter);
                        paramIndex++;
                    }
                    break;
            }
            
            if (dateCondition) {
                whereConditions.push(dateCondition);
            }
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Main query to get logs with student information from rfid_logs table
        const logsQuery = `
            SELECT
                rl.id,
                COALESCE(s.rfid, rl.rfid) as rfid,
                rl.tap_count,
                rl.tap_type as log_type,
                rl.timestamp,
                rl.created_at,
                s.first_name,
                s.last_name,
                gs.grade_level,
                gs.section_name as section,
                s.lrn,
                CONCAT(s.last_name, ', ', s.first_name) as student_name,
                CASE
                    WHEN rl.tap_type = 'time_in' THEN 'Student Time In'
                    WHEN rl.tap_type = 'time_out' THEN 'Student Time Out'
                    ELSE 'RFID Activity'
                END as description
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid
            LEFT JOIN grade_sections gs ON s.grade_section_id = gs.id
            ${whereClause}
            ORDER BY rl.timestamp DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        
        queryParams.push(pageSize, offset);
        
        // Count query for pagination
        const countQuery = `
            SELECT COUNT(*) as total
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid
            LEFT JOIN grade_sections gs ON s.grade_section_id = gs.id
            ${whereClause}
        `;
        
        const countParams = queryParams.slice(0, -2); // Remove LIMIT and OFFSET params
        
        // Execute both queries
        console.log('DEBUG: Executing logs query:', logsQuery);
        console.log('DEBUG: Query params:', queryParams);
        console.log('DEBUG: Count query:', countQuery);
        console.log('DEBUG: Count params:', countParams);

        const [logsResult, countResult] = await Promise.all([
            pool.query(logsQuery, queryParams),
            pool.query(countQuery, countParams)
        ]);

        console.log('DEBUG: Logs query result row count:', logsResult.rows.length);
        console.log('DEBUG: Count query result:', countResult.rows[0]);

        const logs = logsResult.rows;
        const totalLogs = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalLogs / pageSize);

        console.log('DEBUG: Processed logs count:', logs.length);
        console.log('DEBUG: Total logs in DB:', totalLogs);
        console.log('DEBUG: Total pages:', totalPages);
        
        // Get summary data for today from rfid_logs
        const summaryQuery = `
            SELECT 
                COUNT(CASE WHEN tap_type = 'time_in' AND timestamp >= CURRENT_DATE THEN 1 END) as time_in_today,
                COUNT(CASE WHEN tap_type = 'time_out' AND timestamp >= CURRENT_DATE THEN 1 END) as time_out_today,
                COUNT(*) as total_logs
            FROM rfid_logs
        `;
        
        const summaryResult = await pool.query(summaryQuery);
        const summary = {
            timeInToday: parseInt(summaryResult.rows[0].time_in_today),
            timeOutToday: parseInt(summaryResult.rows[0].time_out_today),
            totalLogs: parseInt(summaryResult.rows[0].total_logs)
        };
        
        const pagination = {
            currentPage: page,
            totalPages: totalPages,
            totalLogs: totalLogs,
            pageSize: pageSize,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages
        };

        console.log('DEBUG: Returning result object with keys:', Object.keys({ logs, pagination, summary }));
        console.log('DEBUG: Sample log data structure:', logs.length > 0 ? Object.keys(logs[0]) : 'No logs');

        return {
            logs: logs,
            pagination: pagination,
            summary: summary
        };
        
    } catch (error) {
        console.error('[LOGS] Error getting paginated logs:', error.message);
        throw new Error(`Failed to retrieve logs: ${error.message}`);
    }
}

/**
 * Get recent logs (for dashboard or quick view) from rfid_logs table
 * @param {number} limit - Number of recent logs to retrieve
 * @returns {Promise<Array>} Array of recent log entries
 */
export async function getRecentLogs(limit = 10) {
    try {
        const query = `
            SELECT
                rl.id,
                COALESCE(s.rfid, rl.rfid) as rfid,
                rl.tap_count,
                rl.tap_type as log_type,
                rl.timestamp,
                rl.created_at,
                s.first_name,
                s.last_name,
                gs.grade_level,
                gs.section_name as section,
                s.lrn,
                CONCAT(s.last_name, ', ', s.first_name) as student_name,
                CASE
                    WHEN rl.tap_type = 'time_in' THEN 'Student Time In'
                    WHEN rl.tap_type = 'time_out' THEN 'Student Time Out'
                    ELSE 'RFID Activity'
                END as description
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid
            LEFT JOIN grade_sections gs ON s.grade_section_id = gs.id
            ORDER BY rl.timestamp DESC
            LIMIT $1
        `;
        
        const result = await pool.query(query, [limit]);
        return result.rows;
        
    } catch (error) {
        console.error('Error getting recent RFID logs:', error);
        throw new Error(`Failed to retrieve recent RFID logs: ${error.message}`);
    }
}

/**
 * Log student RFID scan activity
 * @param {string} rfid - RFID tag
 * @param {number} studentId - Student ID
 * @param {string} tapType - 'time_in' or 'time_out'
 * @returns {Promise<Object>} Result object
 */
export async function logRfidActivity(rfid, studentId, tapType) {
    try {
        const description = tapType === 'time_in' ? 'Student Time In' : 'Student Time Out';
        const details = `RFID scan: ${tapType}`;
        
        return await createLogEntry(tapType, description, rfid, studentId, details);
    } catch (error) {
        console.error('Error logging RFID activity:', error);
        throw new Error(`Failed to log RFID activity: ${error.message}`);
    }
}

/**
 * Log student management activity
 * @param {string} action - 'added', 'updated', 'deleted'
 * @param {number} studentId - Student ID
 * @param {string} studentName - Student name
 * @param {string} details - Additional details
 * @returns {Promise<Object>} Result object
 */
export async function logStudentActivity(action, studentId, studentName, details = null) {
    try {
        const logType = `student_${action}`;
        const description = `Student ${action.charAt(0).toUpperCase() + action.slice(1)}`;
        const logDetails = details || `Student ${studentName} was ${action}`;
        
        return await createLogEntry(logType, description, null, studentId, logDetails);
    } catch (error) {
        console.error('Error logging student activity:', error);
        throw new Error(`Failed to log student activity: ${error.message}`);
    }
}

/**
 * Log authentication activity
 * @param {string} action - 'login' or 'logout'
 * @param {string} username - Username
 * @param {string} details - Additional details
 * @returns {Promise<Object>} Result object
 */
export async function logAuthActivity(action, username, details = null) {
    try {
        const description = `Administrator ${action.charAt(0).toUpperCase() + action.slice(1)}`;
        const logDetails = details || `User ${username} ${action === 'login' ? 'logged in' : 'logged out'}`;
        
        return await createLogEntry(action, description, null, null, logDetails);
    } catch (error) {
        console.error('Error logging auth activity:', error);
        throw new Error(`Failed to log authentication activity: ${error.message}`);
    }
}

/**
 * Delete a specific log entry
 * @param {number} logId - ID of the log entry to delete
 * @returns {Promise<Object>} Result object
 */
export async function deleteLogEntry(logId) {
    try {
        const query = `
            DELETE FROM rfid_logs 
            WHERE id = $1
            RETURNING *
        `;
        
        const result = await pool.query(query, [logId]);
        
        if (result.rowCount === 0) {
            return { success: false, message: 'Log entry not found' };
        }
        
        return { success: true, deletedLog: result.rows[0] };
    } catch (error) {
        console.error('[LOGS] Error deleting log entry:', error.message);
        throw new Error(`Failed to delete log entry: ${error.message}`);
    }
}

/**
 * Get available grade levels and sections from logs for a specific date
 * @param {string} dateFilter - Date filter ('today', 'YYYY-MM-DD', etc.)
 * @returns {Promise<Object>} Object with grades array and sections map
 */
export async function getAvailableFiltersForDate(dateFilter = 'today') {
    try {
        console.log('[LOGS] Getting available filters for date:', dateFilter);

        // Build date condition
        let dateCondition = '';
        let queryParams = [];
        
        if (dateFilter === 'today') {
            dateCondition = `WHERE (rl.timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila')::date`;
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
            dateCondition = `WHERE (rl.timestamp AT TIME ZONE 'Asia/Manila')::date = $1::date`;
            queryParams.push(dateFilter);
        }

        // Query to get unique grade/section combinations from logs
        const query = `
            SELECT DISTINCT
                gs.grade_level,
                gs.section_name as section
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid
            LEFT JOIN grade_sections gs ON s.grade_section_id = gs.id
            ${dateCondition}
            AND gs.grade_level IS NOT NULL
            ORDER BY gs.grade_level, gs.section_name
        `;

        const result = await pool.query(query, queryParams);
        
        // Build grades array and sections map
        const gradesSet = new Set();
        const sectionsMap = {};

        for (const row of result.rows) {
            if (row.grade_level) {
                gradesSet.add(row.grade_level);
                
                if (!sectionsMap[row.grade_level]) {
                    sectionsMap[row.grade_level] = [];
                }
                if (row.section && !sectionsMap[row.grade_level].includes(row.section)) {
                    sectionsMap[row.grade_level].push(row.section);
                }
            }
        }

        const grades = Array.from(gradesSet).sort((a, b) => {
            // Sort numerically if possible
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return String(a).localeCompare(String(b));
        });

        console.log('[LOGS] Available grades:', grades);
        console.log('[LOGS] Sections map:', sectionsMap);

        return { grades, sectionsMap };
        
    } catch (error) {
        console.error('[LOGS] Error getting available filters:', error.message);
        throw new Error(`Failed to retrieve available filters: ${error.message}`);
    }
}

/**
 * Get all logs for a specific date for export (no pagination)
 * Groups logs by student to consolidate time_in and time_out into single rows
 * @param {string} dateFilter - Date filter ('today', 'YYYY-MM-DD', etc.)
 * @param {string} gradeFilter - Grade level filter (optional, 'all' or specific grade)
 * @param {string} sectionFilter - Section filter (optional, 'all' or specific section)
 * @returns {Promise<Array>} Array of grouped attendance records
 */
export async function getLogsForExport(dateFilter = 'today', gradeFilter = 'all', sectionFilter = 'all') {
    try {
        console.log('[LOGS] Getting logs for export with filters:', { dateFilter, gradeFilter, sectionFilter });

        // Build WHERE conditions
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;
        
        // Date filter
        if (dateFilter === 'today') {
            whereConditions.push(`(rl.timestamp AT TIME ZONE 'Asia/Manila')::date = (NOW() AT TIME ZONE 'Asia/Manila')::date`);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
            whereConditions.push(`(rl.timestamp AT TIME ZONE 'Asia/Manila')::date = $${paramIndex}::date`);
            queryParams.push(dateFilter);
            paramIndex++;
        }

        // Grade filter
        if (gradeFilter && gradeFilter !== 'all') {
            whereConditions.push(`gs.grade_level = $${paramIndex}`);
            queryParams.push(gradeFilter);
            paramIndex++;
        }

        // Section filter
        if (sectionFilter && sectionFilter !== 'all') {
            whereConditions.push(`gs.section_name = $${paramIndex}`);
            queryParams.push(sectionFilter);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Query to get all logs for the date, ordered by student and timestamp
        const query = `
            SELECT
                rl.id,
                rl.rfid,
                rl.tap_type as log_type,
                rl.timestamp,
                s.first_name,
                s.last_name,
                gs.grade_level,
                gs.section_name as section,
                CONCAT(s.last_name, ', ', s.first_name) as student_name
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid
            LEFT JOIN grade_sections gs ON s.grade_section_id = gs.id
            ${whereClause}
            ORDER BY gs.grade_level, gs.section_name, s.last_name, s.first_name, rl.timestamp ASC
        `;

        const result = await pool.query(query, queryParams);
        const logs = result.rows;

        console.log('[LOGS] Raw logs count:', logs.length);

        // Group logs by student, finding first time_in and last time_out for each student
        const studentMap = new Map();

        for (const log of logs) {
            const studentKey = log.rfid || log.student_name || 'unknown';
            
            if (!studentMap.has(studentKey)) {
                studentMap.set(studentKey, {
                    name: log.student_name || '(N/A)',
                    grade: log.grade_level || '',
                    section: log.section || '',
                    timeIn: null,
                    timeOut: null
                });
            }

            const student = studentMap.get(studentKey);
            const timestamp = new Date(log.timestamp);

            if (log.log_type === 'time_in') {
                // Take the first time_in
                if (!student.timeIn) {
                    student.timeIn = timestamp;
                }
            } else if (log.log_type === 'time_out') {
                // Take the last time_out
                student.timeOut = timestamp;
            }
        }

        // Convert map to array
        const groupedLogs = Array.from(studentMap.values());
        
        console.log('[LOGS] Grouped logs count:', groupedLogs.length);

        return groupedLogs;
        
    } catch (error) {
        console.error('[LOGS] Error getting logs for export:', error.message);
        throw new Error(`Failed to retrieve logs for export: ${error.message}`);
    }
}

/**
 * Delete old logs (cleanup function)
 * @param {number} daysToKeep - Number of days to keep logs
 * @returns {Promise<Object>} Result object
 */
export async function cleanupOldLogs(daysToKeep = 90) {
    try {
        const query = `
            DELETE FROM activity_logs 
            WHERE timestamp < NOW() - INTERVAL '${daysToKeep} days'
        `;
        
        const result = await pool.query(query);
        
        // Cleanup complete
        return { success: true, deletedCount: result.rowCount };
    } catch (error) {
        console.error('[LOGS] Error cleaning up old logs:', error.message);
        throw new Error(`Failed to cleanup old logs: ${error.message}`);
    }
}
