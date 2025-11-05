// RFID logging service
const { supabase } = require('../config/database');
const { getStudentByRfid } = require('./studentService');

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
            console.log('🧹 Cleaning up existing subscription...');
            supabase.removeChannel(realtimeSubscription);
        }

        console.log('🔄 Initializing real-time subscription for rfid_logs...');

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
                    console.log('📡 Real-time change detected:', {
                        event: payload.eventType,
                        table: payload.table,
                        recordId: payload.new?.id || payload.old?.id,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Notify the renderer process about the change
                    if (onLogChange) {
                        onLogChange({
                            eventType: payload.eventType, // INSERT, UPDATE, DELETE
                            record: payload.new || payload.old,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            )
            .subscribe((status, err) => {
                if (err) {
                    console.error('❌ Real-time subscription error:', err);
                    return;
                }
                
                console.log('📡 Real-time subscription status:', status);
                
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Successfully subscribed to rfid_logs changes');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Channel error in real-time subscription');
                } else if (status === 'TIMED_OUT') {
                    console.error('⏰ Real-time subscription timed out');
                } else if (status === 'CLOSED') {
                    console.log('🔒 Real-time subscription closed');
                }
            });

        console.log('✅ Real-time subscription initialized');
        return true;
    } catch (error) {
        console.error('❌ Error initializing real-time subscription:', error);
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
        console.log('✓ Real-time subscription cleaned up');
    }
}

/**
 * Validate and log RFID scan
 * @param {string} rfid - The RFID/UID from the card
 * @param {number} tapCount - 1 for time in, 2 for time out
 * @returns {Promise<Object>} Result object with success status and student info
 */
async function validateAndLogRfid(rfid, tapCount) {
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

        // Step 2: Insert log entry
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
        console.log(`✓ Logged: ${studentName} (${student.grade_level}) - ${tapCount === 1 ? 'Time In' : 'Time Out'}`);
        
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
    initializeRealtimeSubscription,
    cleanupRealtimeSubscription
};
