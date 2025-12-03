// Grade Sections Service - CRUD operations for grade_sections table
import { pool } from './db-connection.js';

/**
 * Get all grade sections grouped by grade level
 * @returns {Promise<Object>} Object with grades array and sections organized by grade
 */
export async function getAllGradeSections() {
    try {
        const query = `
            SELECT 
                gs.id,
                gs.grade_level,
                gs.section_name,
                gs.created_at,
                COUNT(s.id) as student_count
            FROM grade_sections gs
            LEFT JOIN students s ON gs.id = s.grade_section_id
            GROUP BY gs.id, gs.grade_level, gs.section_name, gs.created_at
            ORDER BY 
                CASE 
                    WHEN gs.grade_level = 'K' THEN 0 
                    ELSE CAST(gs.grade_level AS INTEGER) 
                END,
                gs.section_name
        `;
        
        const result = await pool.query(query);
        
        // Group sections by grade level
        const groupedSections = {};
        const grades = [];
        
        result.rows.forEach(row => {
            if (!groupedSections[row.grade_level]) {
                groupedSections[row.grade_level] = [];
                grades.push(row.grade_level);
            }
            groupedSections[row.grade_level].push({
                id: row.id,
                sectionName: row.section_name,
                studentCount: parseInt(row.student_count) || 0,
                createdAt: row.created_at
            });
        });
        
        return {
            success: true,
            grades: grades,
            sections: groupedSections
        };
    } catch (error) {
        console.error('[GRADE-SECTIONS] Error fetching grade sections:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Add a new section to a grade level
 * @param {string} gradeLevel - The grade level (e.g., "1", "2", "K")
 * @param {string} sectionName - The section name
 * @returns {Promise<Object>} Result with success status and new section data
 */
export async function addSection(gradeLevel, sectionName) {
    try {
        // Validate inputs
        if (!gradeLevel || !sectionName) {
            return {
                success: false,
                message: 'Grade level and section name are required'
            };
        }
        
        // Normalize section name to Title Case
        const normalizedName = sectionName.trim().replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        
        const query = `
            INSERT INTO grade_sections (grade_level, section_name)
            VALUES ($1, $2)
            RETURNING id, grade_level, section_name, created_at
        `;
        
        const result = await pool.query(query, [gradeLevel, normalizedName]);
        
        console.log(`[GRADE-SECTIONS] Added new section: Grade ${gradeLevel} - ${normalizedName}`);
        
        return {
            success: true,
            section: {
                id: result.rows[0].id,
                gradeLevel: result.rows[0].grade_level,
                sectionName: result.rows[0].section_name,
                studentCount: 0,
                createdAt: result.rows[0].created_at
            }
        };
    } catch (error) {
        console.error('[GRADE-SECTIONS] Error adding section:', error);
        
        // Handle unique constraint violation
        if (error.code === '23505') {
            return {
                success: false,
                message: `Section "${sectionName}" already exists in Grade ${gradeLevel}`
            };
        }
        
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Update a section's name
 * @param {number} sectionId - The section ID
 * @param {string} newSectionName - The new section name
 * @returns {Promise<Object>} Result with success status
 */
export async function updateSection(sectionId, newSectionName) {
    try {
        // Validate inputs
        if (!sectionId || !newSectionName) {
            return {
                success: false,
                message: 'Section ID and new name are required'
            };
        }
        
        // Normalize section name to Title Case
        const normalizedName = newSectionName.trim().replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        
        const query = `
            UPDATE grade_sections 
            SET section_name = $1
            WHERE id = $2
            RETURNING id, grade_level, section_name
        `;
        
        const result = await pool.query(query, [normalizedName, sectionId]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: 'Section not found'
            };
        }
        
        console.log(`[GRADE-SECTIONS] Updated section ${sectionId} to: ${normalizedName}`);
        
        return {
            success: true,
            section: {
                id: result.rows[0].id,
                gradeLevel: result.rows[0].grade_level,
                sectionName: result.rows[0].section_name
            }
        };
    } catch (error) {
        console.error('[GRADE-SECTIONS] Error updating section:', error);
        
        // Handle unique constraint violation
        if (error.code === '23505') {
            return {
                success: false,
                message: `A section with this name already exists in this grade level`
            };
        }
        
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Delete a section
 * @param {number} sectionId - The section ID to delete
 * @returns {Promise<Object>} Result with success status
 */
export async function deleteSection(sectionId) {
    try {
        // First check if there are students in this section
        const checkQuery = `
            SELECT COUNT(*) as student_count 
            FROM students 
            WHERE grade_section_id = $1
        `;
        const checkResult = await pool.query(checkQuery, [sectionId]);
        const studentCount = parseInt(checkResult.rows[0].student_count);
        
        if (studentCount > 0) {
            return {
                success: false,
                message: `Cannot delete section: ${studentCount} student(s) are assigned to this section. Please reassign or remove students first.`
            };
        }
        
        // Get section info before deleting (for logging)
        const infoQuery = `SELECT grade_level, section_name FROM grade_sections WHERE id = $1`;
        const infoResult = await pool.query(infoQuery, [sectionId]);
        
        if (infoResult.rows.length === 0) {
            return {
                success: false,
                message: 'Section not found'
            };
        }
        
        const { grade_level, section_name } = infoResult.rows[0];
        
        // Delete the section
        const deleteQuery = `DELETE FROM grade_sections WHERE id = $1`;
        await pool.query(deleteQuery, [sectionId]);
        
        console.log(`[GRADE-SECTIONS] Deleted section: Grade ${grade_level} - ${section_name}`);
        
        return {
            success: true,
            message: `Section "${section_name}" deleted successfully`
        };
    } catch (error) {
        console.error('[GRADE-SECTIONS] Error deleting section:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Add a new grade level with an initial section
 * @param {string} gradeLevel - The new grade level
 * @param {string} initialSection - The first section name for this grade
 * @returns {Promise<Object>} Result with success status
 */
export async function addGradeLevel(gradeLevel, initialSection) {
    try {
        // Check if grade level already exists
        const checkQuery = `SELECT COUNT(*) as count FROM grade_sections WHERE grade_level = $1`;
        const checkResult = await pool.query(checkQuery, [gradeLevel]);
        
        if (parseInt(checkResult.rows[0].count) > 0) {
            return {
                success: false,
                message: `Grade ${gradeLevel} already exists`
            };
        }
        
        // Add the grade with initial section
        return await addSection(gradeLevel, initialSection);
    } catch (error) {
        console.error('[GRADE-SECTIONS] Error adding grade level:', error);
        return {
            success: false,
            message: error.message
        };
    }
}
