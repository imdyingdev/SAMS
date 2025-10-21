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
        
        console.log('Log entry created:', result.rows[0]);
        return { success: true, log: result.rows[0] };
    } catch (error) {
        console.error('Error creating log entry:', error);
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
        const offset = (page - 1) * pageSize;
        
        // Build WHERE clause based on filters
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;
        
        // Search term filter
        if (searchTerm && searchTerm.trim() !== '') {
            whereConditions.push(`(
                rl.rfid ILIKE $${paramIndex} OR
                CONCAT(s.first_name, ' ', s.last_name) ILIKE $${paramIndex} OR
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
            
            switch (dateFilter.trim()) {
                case 'today':
                    dateCondition = `rl.timestamp >= CURRENT_DATE AND rl.timestamp < CURRENT_DATE + INTERVAL '1 day'`;
                    break;
                case 'yesterday':
                    dateCondition = `rl.timestamp >= CURRENT_DATE - INTERVAL '1 day' AND rl.timestamp < CURRENT_DATE`;
                    break;
                case 'week':
                    dateCondition = `rl.timestamp >= DATE_TRUNC('week', CURRENT_DATE) AND rl.timestamp < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'`;
                    break;
                case 'month':
                    dateCondition = `rl.timestamp >= DATE_TRUNC('month', CURRENT_DATE) AND rl.timestamp < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`;
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
                rl.rfid,
                rl.tap_count,
                rl.tap_type as log_type,
                rl.timestamp,
                rl.created_at,
                s.first_name,
                s.last_name,
                s.grade_level,
                s.lrn,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                CASE 
                    WHEN rl.tap_type = 'time_in' THEN 'Student Time In'
                    WHEN rl.tap_type = 'time_out' THEN 'Student Time Out'
                    ELSE 'RFID Activity'
                END as description
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid::text
            ${whereClause}
            ORDER BY rl.timestamp DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        
        queryParams.push(pageSize, offset);
        
        // Count query for pagination
        const countQuery = `
            SELECT COUNT(*) as total
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid::text
            ${whereClause}
        `;
        
        const countParams = queryParams.slice(0, -2); // Remove LIMIT and OFFSET params
        
        // Execute both queries
        const [logsResult, countResult] = await Promise.all([
            pool.query(logsQuery, queryParams),
            pool.query(countQuery, countParams)
        ]);
        
        const logs = logsResult.rows;
        const totalLogs = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalLogs / pageSize);
        
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
        
        console.log(`Retrieved ${logs.length} RFID logs for page ${page}/${totalPages}`);
        
        return {
            logs: logs,
            pagination: pagination,
            summary: summary
        };
        
    } catch (error) {
        console.error('Error getting paginated RFID logs:', error);
        throw new Error(`Failed to retrieve RFID logs: ${error.message}`);
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
                rl.rfid,
                rl.tap_count,
                rl.tap_type as log_type,
                rl.timestamp,
                rl.created_at,
                s.first_name,
                s.last_name,
                s.grade_level,
                s.lrn,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                CASE 
                    WHEN rl.tap_type = 'time_in' THEN 'Student Time In'
                    WHEN rl.tap_type = 'time_out' THEN 'Student Time Out'
                    ELSE 'RFID Activity'
                END as description
            FROM rfid_logs rl
            LEFT JOIN students s ON rl.rfid = s.rfid::text
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
        
        console.log(`Cleaned up ${result.rowCount} old log entries`);
        return { success: true, deletedCount: result.rowCount };
    } catch (error) {
        console.error('Error cleaning up old logs:', error);
        throw new Error(`Failed to cleanup old logs: ${error.message}`);
    }
}
