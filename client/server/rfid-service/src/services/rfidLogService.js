// RFID logging service
const { supabase } = require('../config/database');
const { getStudentByRfid } = require('./studentService');

// Time window for showing confirmation modal (in minutes)
// If someone tries to time out within this window after timing in, show confirmation modal
// For testing/presentation: 1 minute, for production: 60 minutes (1 hour)
const MODAL_TIME_WINDOW_MINUTES = 1; // Change to 60 for production

// Store subscription for cleanup
let realtimeSubscription = null;

/**
 * Initialize real-time subscription for log changes
 * @param {Function} onLogChange - Callback function when logs change
 */
function initializeRealtimeSubscription(onLogChange) {
    try {
        // Clean up existing subscription
        if (realtimeSubscription) {
            console.log('Cleaning up existing subscription...');
            supabase.removeChannel(realtimeSubscription);
        }

        console.log('Initializing real-time subscription for rfid_logs...');
        let subscriptionSuccessful = false;

        // Subscribe to rfid_logs table changes
        realtimeSubscription = supabase
            .channel('rfid_logs_changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'rfid_logs' 
                }, 
                (payload) => {
                    const receiveTime = new Date();
                    const payloadTime = payload.new?.timestamp || payload.old?.timestamp;
                    const delay = payloadTime ? (receiveTime - new Date(payloadTime)) : 'unknown';
                    
                    console.log('Real-time change detected:', {
                        event: payload.eventType,
                        table: payload.table,
                        recordId: payload.new?.id || payload.old?.id,
                        payloadTimestamp: payloadTime,
                        receiveTime: receiveTime.toISOString(),
                        estimatedDelay: typeof delay === 'number' ? `${delay.toFixed(2)}ms` : delay
                    });
                    
                    // Notify the renderer process about the change
                    if (onLogChange) {
                        onLogChange({
                            eventType: payload.eventType, // INSERT, UPDATE, DELETE
                            record: payload.new || payload.old,
                            timestamp: receiveTime.toISOString()
                        });
                    }
                }
            )
            .subscribe((status, err) => {
                if (err) {
                    console.error('Real-time subscription error:', err);
                    subscriptionSuccessful = false;
                    return;
                }
                
                console.log('Real-time subscription status:', status);
                
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to rfid_logs changes');
                    subscriptionSuccessful = true;
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Channel error in real-time subscription');
                    subscriptionSuccessful = false;
                } else if (status === 'TIMED_OUT') {
                    console.error('Real-time subscription timed out - will use polling fallback');
                    subscriptionSuccessful = false;
                } else if (status === 'CLOSED') {
                    console.log('Real-time subscription closed');
                    subscriptionSuccessful = false;
                }
            });

        console.log('Real-time subscription initialized');
        
        // Return the subscription status
        return subscriptionSuccessful;
    } catch (error) {
        console.error('Error initializing real-time subscription:', error);
        return false;
    }
}

/**
 * Cleanup real-time subscription
 */
function cleanupRealtimeSubscription() {
    if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
        realtimeSubscription = null;
        console.log('Real-time subscription cleaned up');
    }
}

/**
 * Get today's logs for a specific RFID
 * @param {string} rfid - The RFID to check
 * @returns {Promise<Array>} Array of today's logs for this RFID
 */
async function getTodayLogsForRfid(rfid) {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('rfid_logs')
            .select('*')
            .eq('rfid', rfid)
            .gte('timestamp', `${today}T00:00:00`)
            .lte('timestamp', `${today}T23:59:59`)
            .order('timestamp', { ascending: true });

        if (error) {
            console.error('Error fetching today logs for RFID:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getTodayLogsForRfid:', error);
        return [];
    }
}

/**
 * Validate and log RFID scan with confirmation bypass
 * @param {string} rfid - The RFID/UID from the card
 * @param {number} tapCount - 1 for time in, 2 for time out
 * @param {boolean} confirmed - True to bypass time window confirmation
 * @returns {Promise<Object>} Result with success status and student info
 */
async function validateAndLogRfid(rfid, tapCount, confirmed = false) {
    try {
        // Step 1: Validate RFID exists in students table
        const student = await getStudentByRfid(rfid);

        if (!student) {
            console.warn(`RFID ${rfid} not found in students table`);
            return {
                success: false,
                message: 'RFID not found in database',
                student: null,
                log: null
            };
        }

        // Step 2: Check today's logs for this RFID to prevent duplicates
        const todayLogs = await getTodayLogsForRfid(rfid);
        console.log(`Found ${todayLogs.length} existing logs for RFID ${rfid} today`);
        
        // Step 3: Validate business rules based on existing logs
        if (todayLogs.length > 0) {
            // Check for recent duplicate (within last 5 seconds)
            const now = new Date();
            const recentLogs = todayLogs.filter(log => {
                const logTime = new Date(log.timestamp);
                const timeDiff = (now - logTime) / 1000; // seconds
                return timeDiff < 5; // Within 5 seconds
            });
            
            if (recentLogs.length > 0) {
                console.warn(`Duplicate tap detected within 5 seconds for RFID ${rfid}`);
                return {
                    success: false,
                    message: 'Duplicate tap detected - please wait before tapping again',
                    student: student,
                    log: null
                };
            }
            
            // Get the latest log to determine current state
            const latestLog = todayLogs[todayLogs.length - 1];
            
            // Check if student has already completed full cycle (time in + time out) for today
            const hasTimeIn = todayLogs.some(log => log.tap_type === 'time_in');
            const hasTimeOut = todayLogs.some(log => log.tap_type === 'time_out');
            
            if (hasTimeIn && hasTimeOut) {
                console.warn(`Student ${rfid} has already completed full attendance for today (time in + time out)`);
                return {
                    success: false,
                    message: "You've already marked present today! See you again tomorrow.",
                    student: student,
                    log: null
                };
            }
            
            // Business rule validation
            if (tapCount === 1) {
                // Trying to time in
                if (latestLog.tap_type === 'time_in') {
                    console.warn(`Student ${rfid} already timed in today`);
                    return {
                        success: false,
                        message: 'Student already timed in today',
                        student: student,
                        log: null
                    };
                }
                // If last was time_out, allow time_in (re-entry) - but this is blocked by the full cycle check above
            } else if (tapCount === 2) {
                // Trying to time out
                if (latestLog.tap_type === 'time_out') {
                    console.warn(`Student ${rfid} already timed out today`);
                    return {
                        success: false,
                        message: 'Student already timed out today',
                        student: student,
                        log: null
                    };
                }
                if (latestLog.tap_type !== 'time_in') {
                    console.warn(`Student ${rfid} cannot time out without timing in first`);
                    return {
                        success: false,
                        message: 'Cannot time out without timing in first',
                        student: student,
                        log: null
                    };
                }
                
                // Check time window for confirmation modal (unless already confirmed)
                if (!confirmed) {
                    const timeInTimestamp = new Date(latestLog.timestamp);
                    const now = new Date();
                    const timeDifferenceMinutes = (now - timeInTimestamp) / (1000 * 60);
                    
                    if (timeDifferenceMinutes < MODAL_TIME_WINDOW_MINUTES) {
                        console.log(`Time out attempted within ${timeDifferenceMinutes.toFixed(1)} minutes of time in - requiring confirmation`);
                        return {
                            success: false,
                            message: 'confirm_timeout_early',
                            requiresConfirmation: true,
                            timeSinceTimeIn: Math.round(timeDifferenceMinutes),
                            student: student,
                            log: null
                        };
                    }
                } else {
                    console.log('Time out confirmed by user - bypassing time window check');
                }
            }
        } else {
            // No logs today - only allow time_in as first action
            if (tapCount !== 1) {
                console.warn(`Student ${rfid} must time in first`);
                return {
                    success: false,
                    message: 'Must time in first',
                    student: student,
                    log: null
                };
            }
        }

        // Step 4: Insert log entry (all validations passed)
        const { data: log, error: logError } = await supabase
            .from('rfid_logs')
            .insert([{
                rfid: rfid,
                tap_count: tapCount,
                tap_type: tapCount === 1 ? 'time_in' : 'time_out',
                timestamp: new Date().toISOString()
            }])
            .select()
            .single();

        if (logError) {
            console.error('Error inserting log:', logError);
            return {
                success: false,
                message: 'Failed to log RFID',
                student: student,
                log: null
            };
        }

        // Success
        const studentName = `${student.first_name} ${student.last_name}`;
        console.log(`Logged: ${studentName} (${student.grade_sections.grade_level}) - ${tapCount === 1 ? 'Time In' : 'Time Out'}`);
        
        return {
            success: true,
            message: 'RFID logged successfully',
            student: student,
            log: log
        };

    } catch (error) {
        console.error('Error in validateAndLogRfid:', error);
        return {
            success: false,
            message: error.message,
            student: null,
            log: null
        };
    }
}

/**
 * Get recent RFID logs with student information
 * @param {number} limit - Number of recent logs to fetch
 * @returns {Promise<Array>} Array of log entries
 */
async function getRecentLogs(limit = 5) {
    try {
        const { data, error } = await supabase
            .from('rfid_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching logs:', error);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error in getRecentLogs:', error);
        return [];
    }
}

/**
 * Get grade level counts for today (database-driven)
 * @returns {Promise<Object>} Grade level counts with timeIn/timeOut per grade
 */
async function getTodayGradeLevelCounts() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get all today's logs
        const { data: logs, error } = await supabase
            .from('rfid_logs')
            .select('rfid, tap_type, timestamp')
            .gte('timestamp', `${today}T00:00:00`)
            .lte('timestamp', `${today}T23:59:59`)
            .order('timestamp', { ascending: true });

        if (error) {
            console.error('Error fetching grade level counts:', error);
            return { gradeLevelCounts: {}, gradeLevelOrder: [] };
        }

        // Group by RFID to get current state
        const rfidStates = {};
        logs.forEach(log => {
            if (!rfidStates[log.rfid]) {
                rfidStates[log.rfid] = [];
            }
            rfidStates[log.rfid].push(log);
        });

        const gradeLevelCounts = {};
        const gradeLevelOrder = [];

        // Process each RFID to determine current state
        for (const rfid of Object.keys(rfidStates)) {
            const rfidLogs = rfidStates[rfid];
            const latestLog = rfidLogs[rfidLogs.length - 1];
            
            // Get student info for grade level
            const { data: student } = await supabase
                .from('students')
                .select(`
                    grade_sections!inner(grade_level)
                `)
                .eq('rfid', rfid)
                .single();

            if (student && student.grade_sections) {
                const gradeLevel = student.grade_sections.grade_level;
                
                if (!gradeLevelCounts[gradeLevel]) {
                    gradeLevelCounts[gradeLevel] = { timeIn: 0, timeOut: 0 };
                }
                
                // Count based on latest state
                if (latestLog.tap_type === 'time_in') {
                    gradeLevelCounts[gradeLevel].timeIn++;
                } else if (latestLog.tap_type === 'time_out') {
                    gradeLevelCounts[gradeLevel].timeIn++;
                    gradeLevelCounts[gradeLevel].timeOut++;
                }
                
                // Update grade level order (most recent first)
                const index = gradeLevelOrder.indexOf(gradeLevel);
                if (index > -1) {
                    gradeLevelOrder.splice(index, 1);
                }
                gradeLevelOrder.unshift(gradeLevel);
            }
        }

        return { gradeLevelCounts, gradeLevelOrder };

    } catch (error) {
        console.error('Error in getTodayGradeLevelCounts:', error);
        return { gradeLevelCounts: {}, gradeLevelOrder: [] };
    }
}

/**
 * Check if RFID was tapped recently (for rate limiting)
 * @param {string} rfid - The RFID to check
 * @param {number} secondsLimit - Seconds to check back (default 5)
 * @returns {Promise<boolean>} True if tapped recently
 */
async function wasRfidTappedRecently(rfid, secondsLimit = 5) {
    try {
        const cutoffTime = new Date(Date.now() - (secondsLimit * 1000)).toISOString();
        
        const { data, error } = await supabase
            .from('rfid_logs')
            .select('timestamp')
            .eq('rfid', rfid)
            .gte('timestamp', cutoffTime)
            .limit(1);

        if (error) {
            console.error('Error checking recent taps:', error);
            return false;
        }

        return data && data.length > 0;

    } catch (error) {
        console.error('Error in wasRfidTappedRecently:', error);
        return false;
    }
}

/**
 * Get recent logs for display (database-driven)
 * @param {number} limit - Number of recent logs to fetch
 * @returns {Promise<Array>} Array of recent log entries with student info
 */
async function getRecentLogsWithStudentInfo(limit = 3) {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's logs
        const { data: logs, error } = await supabase
            .from('rfid_logs')
            .select('*')
            .gte('timestamp', `${today}T00:00:00`)
            .lte('timestamp', `${today}T23:59:59`)
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching recent logs:', error);
            return [];
        }

        // Enrich with student information
        const enrichedLogs = [];
        for (const log of logs) {
            const { data: student } = await supabase
                .from('students')
                .select(`
                    first_name,
                    last_name,
                    grade_sections!inner(grade_level)
                `)
                .eq('rfid', log.rfid)
                .single();

            enrichedLogs.push({
                rfid: log.rfid,
                studentName: student ? `${student.first_name} ${student.last_name}` : null,
                gradeLevel: student ? student.grade_sections.grade_level : null,
                timestamp: log.timestamp,
                count: log.tap_count
            });
        }

        return enrichedLogs;

    } catch (error) {
        console.error('Error in getRecentLogsWithStudentInfo:', error);
        return [];
    }
}

/**
 * Get total unique students count for today
 * @returns {Promise<number>} Count of unique students
 */
async function getTodayStudentCount() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('rfid_logs')
            .select('rfid')
            .gte('timestamp', `${today}T00:00:00`)
            .lte('timestamp', `${today}T23:59:59`);

        if (error) {
            console.error('Error fetching student count:', error);
            return 0;
        }

        // Get unique RFIDs
        const uniqueRfids = new Set(data.map(log => log.rfid));
        return uniqueRfids.size;

    } catch (error) {
        console.error('Error in getTodayStudentCount:', error);
        return 0;
    }
}

module.exports = {
    validateAndLogRfid,
    getRecentLogs,
    getTodayStudentCount,
    getTodayLogsForRfid,
    getTodayGradeLevelCounts,
    wasRfidTappedRecently,
    getRecentLogsWithStudentInfo,
    initializeRealtimeSubscription,
    cleanupRealtimeSubscription
};
