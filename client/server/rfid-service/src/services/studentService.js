// Student validation service
const { supabase } = require('../config/database');

/**
 * Check if student exists by RFID
 * @param {string} rfid - The RFID/UID from the card
 * @returns {Promise<Object|null>} Student data or null if not found
 */
async function getStudentByRfid(rfid) {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('id, first_name, middle_name, last_name, grade_level, lrn')
            .eq('rfid', rfid)
            .single();

        if (error) {
            console.error('Error fetching student:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getStudentByRfid:', error);
        return null;
    }
}

/**
 * Get all students with RFIDs
 * @returns {Promise<Array>} Array of students
 */
async function getAllStudentsWithRfid() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('id, first_name, last_name, grade_level, rfid')
            .not('rfid', 'is', null);

        if (error) {
            console.error('Error fetching students:', error);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error in getAllStudentsWithRfid:', error);
        return [];
    }
}

module.exports = {
    getStudentByRfid,
    getAllStudentsWithRfid
};
