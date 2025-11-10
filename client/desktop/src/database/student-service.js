import { query } from './db-connection.js';

// Helper function to get grade_section_id from grade_level and section_name
async function getGradeSectionId(gradeLevel, sectionName) {
  if (!gradeLevel || !sectionName) {
    return null;
  }
  
  // Remove 'Grade ' prefix if it exists
  const cleanGrade = gradeLevel.replace(/^Grade\s*/i, '').trim();
  
  try {
    const result = await query(`
      SELECT id FROM grade_sections
      WHERE grade_level = $1 
        AND LOWER(REPLACE(section_name, '.', '')) = LOWER(REPLACE($2, '.', ''))
      LIMIT 1
    `, [cleanGrade, sectionName.trim()]);
    
    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    console.error('[STUDENT] Error getting grade_section_id:', error.message);
    return null;
  }
}

// Create a new student to the database (alias for saveStudent)
async function createStudent(studentData) {
  return saveStudent(studentData);
}

// Save a new student to the database
async function saveStudent(studentData) {

  // Get grade_section_id from grade_level and section
  const gradeSectionId = await getGradeSectionId(studentData.grade_level, studentData.section);
  
  if (!gradeSectionId) {
    throw new Error('Invalid grade level or section combination');
  }

  const insertQuery = `
    INSERT INTO students (first_name, middle_name, last_name, suffix, lrn, grade_section_id, gender, rfid)
    VALUES (INITCAP($1), INITCAP($2), INITCAP($3), INITCAP($4), $5, $6, $7, $8)
    RETURNING id;
  `;

  const params = [
    studentData.first_name,
    studentData.middle_name,
    studentData.last_name,
    studentData.suffix,
    studentData.lrn,
    gradeSectionId,
    studentData.gender || 'Male',
    studentData.rfid && studentData.rfid.trim() !== '' ? studentData.rfid : null
  ];

  try {
    const insertResult = await query(insertQuery, params);
    const studentId = insertResult.rows[0].id;
    
    // Fetch the complete student data with grade and section
    const studentData = await getStudentById(studentId);
    
    return { success: true, data: studentData };
  } catch (error) {
    console.error('Error in saveStudent:', error.message);
    // Provide a more specific error message if it's a unique constraint violation
    if (error.code === '23505') { // PostgreSQL unique violation error code
      if (error.constraint === 'students_lrn_key') {
        throw new Error('A student with this LRN already exists.');
      }
      if (error.constraint === 'students_rfid_key') {
        throw new Error('This RFID card is already assigned to another student.');
      }
    }
    throw new Error('Failed to save student to the database.');
  }
}

// Get all students with RFID assignments (kept for backward compatibility)
async function getAllStudents() {
  try {
    
    const result = await query(`
      SELECT
        s.id,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.suffix,
        s.lrn,
        gs.grade_level,
        gs.section_name as section,
        s.gender,
        s.rfid,
        s.created_at
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      ORDER BY
        gs.grade_level ASC,
        s.last_name ASC,
        s.first_name ASC
    `);
    
    return result.rows;
    
  } catch (error) {
    console.error('[STUDENT] Error fetching students:', error.message);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Get paginated students with search and filters
async function getStudentsPaginated(page = 1, pageSize = 50, searchTerm = '', gradeFilter = '', rfidFilter = '', sectionFilter = '') {
  try {
    
    const offset = (page - 1) * pageSize;
    
    // Build WHERE clause for filters
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;
    
    // Search term filter - search by name, LRN, and RFID
    if (searchTerm && searchTerm.trim()) {
      const searchValue = searchTerm.trim();
      const searchPattern = `%${searchValue}%`;
      
      whereConditions.push(`(
        LOWER(first_name) LIKE LOWER($${paramIndex}) OR
        LOWER(middle_name) LIKE LOWER($${paramIndex}) OR
        LOWER(last_name) LIKE LOWER($${paramIndex}) OR
        CAST(lrn AS TEXT) LIKE $${paramIndex} OR
        rfid LIKE $${paramIndex}
      )`);
      params.push(searchPattern);
      paramIndex += 1;
    }
    
    // Grade filter
    if (gradeFilter && gradeFilter.trim()) {
      whereConditions.push(`gs.grade_level = $${paramIndex}`);
      params.push(gradeFilter.trim());
      paramIndex++;
    }
    
    // Section filter
    if (sectionFilter && sectionFilter.trim()) {
      whereConditions.push(`LOWER(REPLACE(gs.section_name, '.', '')) = LOWER(REPLACE($${paramIndex}, '.', ''))`);
      params.push(sectionFilter.trim());
      paramIndex++;
    }
    
    // RFID filter
    if (rfidFilter && rfidFilter.trim()) {
      if (rfidFilter === 'assigned') {
        whereConditions.push(`rfid IS NOT NULL`);
      } else if (rfidFilter === 'unassigned') {
        whereConditions.push(`rfid IS NULL`);
      }
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params);
    const totalStudents = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalStudents / pageSize);
    
    // Get paginated results
    const dataQuery = `
      SELECT
        s.id,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.suffix,
        s.lrn,
        gs.grade_level,
        gs.section_name as section,
        s.gender,
        s.rfid,
        s.created_at
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      ${whereClause}
      ORDER BY
        gs.grade_level ASC,
        s.last_name ASC,
        s.first_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(pageSize, offset);
    const dataResult = await query(dataQuery, params);
    
    const result = {
      students: dataResult.rows,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalStudents: totalStudents,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
    
    return result;
    
  } catch (error) {
    console.error('[STUDENT] Error:', error.message);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Delete a student by ID
async function deleteStudent(studentId) {
  try {
    
    // First check if student exists
    const checkResult = await query(
      'SELECT first_name, last_name FROM students WHERE id = $1',
      [studentId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    const studentName = `${checkResult.rows[0].first_name} ${checkResult.rows[0].last_name}`;
    
    // Delete the student
    const deleteResult = await query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [studentId]
    );
    
    if (deleteResult.rows.length === 0) {
      throw new Error('Failed to delete student');
    }
    
    return { success: true, deletedStudent: deleteResult.rows[0] };
    
  } catch (error) {
    console.error('[STUDENT] Error:', error.message);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}

// Update a student's information
async function updateStudent(studentId, studentData) {
  try {
    
    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      lrn,
      grade_level,
      section,
      gender,
      rfid
    } = studentData;

    // Get grade_section_id from grade_level and section
    const gradeSectionId = await getGradeSectionId(grade_level, section);
    
    if (!gradeSectionId) {
      throw new Error('Invalid grade level or section combination');
    }

    const result = await query(`
      UPDATE students
      SET
        first_name = INITCAP($1),
        middle_name = INITCAP($2),
        last_name = INITCAP($3),
        suffix = INITCAP($4),
        lrn = $5,
        grade_section_id = $6,
        gender = $7,
        rfid = $8
      WHERE id = $9
      RETURNING id
    `, [
      first_name,
      middle_name || null,
      last_name,
      suffix || null,
      lrn,
      gradeSectionId,
      gender || 'Male',
      rfid && rfid.trim() !== '' ? rfid : null,
      studentId
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Student not found or update failed');
    }
    
    // Fetch the complete student data with grade and section
    const updatedStudent = await getStudentById(studentId);
    
    return { success: true, data: updatedStudent };
    
  } catch (error) {
    console.error('[STUDENT] Error:', error.message);
    throw new Error(`Failed to update student: ${error.message}`);
  }
}

// Get student by ID
async function getStudentById(studentId) {
  try {

    const result = await query(`
      SELECT 
        s.*,
        gs.grade_level,
        gs.section_name as section
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE s.id = $1
    `, [studentId]);

    if (result.rows.length === 0) {
      throw new Error('Student not found');
    }

    return result.rows[0];

  } catch (error) {
    console.error('[STUDENT] Error:', error.message);
    throw new Error(`Failed to fetch student: ${error.message}`);
  }
}

// Get unique grade levels
async function getUniqueGradeLevels() {
  try {
    const result = await query(`
      SELECT DISTINCT grade_level
      FROM grade_sections
      ORDER BY grade_level ASC
    `);

    return result.rows.map(row => row.grade_level);
  } catch (error) {
    console.error('[STUDENT] Error fetching grade levels:', error.message);
    throw new Error(`Failed to fetch grade levels: ${error.message}`);
  }
}

// Get unique sections for a specific grade level
async function getUniqueSections(gradeLevel) {
  try {
    const result = await query(`
      SELECT section_name as section
      FROM grade_sections
      WHERE grade_level = $1
      ORDER BY section_name ASC
    `, [gradeLevel]);

    return result.rows.map(row => row.section);
  } catch (error) {
    console.error('[STUDENT] Error fetching sections:', error.message);
    throw new Error(`Failed to fetch sections: ${error.message}`);
  }
}

// Get all unique sections across all grade levels
async function getAllUniqueSections() {
  try {
    const result = await query(`
      SELECT DISTINCT section_name as section
      FROM grade_sections
      ORDER BY section_name ASC
    `);

    return result.rows.map(row => row.section);
  } catch (error) {
    console.error('[STUDENT] Error fetching all sections:', error.message);
    throw new Error(`Failed to fetch all sections: ${error.message}`);
  }
}

// Get students by grade level and section for SF2 export
async function getStudentsForSF2(gradeLevel, section) {
  try {
    const result = await query(`
      SELECT
        s.id,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.suffix,
        s.lrn,
        gs.grade_level,
        gs.section_name as section,
        s.gender,
        s.rfid,
        s.created_at
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE gs.grade_level = $1 
        AND LOWER(REPLACE(gs.section_name, '.', '')) = LOWER(REPLACE($2, '.', ''))
      ORDER BY s.last_name ASC, s.first_name ASC
    `, [gradeLevel, section]);

    return result.rows;
  } catch (error) {
    console.error('[STUDENT] Error fetching students for SF2:', error.message);
    throw new Error(`Failed to fetch students for SF2: ${error.message}`);
  }
}

// Check for duplicate LRNs and name matches before import
async function checkDuplicateLRNs(students) {
  try {
    // Validate input
    if (!students || !Array.isArray(students)) {
      console.error('[STUDENT] Invalid students parameter:', students);
      return {
        success: false,
        error: 'Invalid students data provided'
      };
    }
    
    console.log(`[STUDENT] Checking ${students.length} students for duplicates and conflicts`);
    
    // Get all existing students
    const allStudentsQuery = `
      SELECT id, lrn, first_name, middle_name, last_name
      FROM students
    `;
    
    const result = await query(allStudentsQuery);
    const existingStudents = result.rows || [];
    
    const exactDuplicates = []; // Same LRN
    const nameConflicts = []; // Same name but different LRN
    
    // Helper function to normalize name for comparison
    const normalizeName = (name) => {
      return (name || '')
        .toLowerCase()
        .trim()
        .replace(/\./g, '') // Remove periods (e.g., "B." -> "B")
        .replace(/\s+/g, ' '); // Normalize spaces
    };
    
    students.forEach(student => {
      const studentLRN = student.lrn.toString();
      const studentFirstName = normalizeName(student.first_name);
      const studentLastName = normalizeName(student.last_name);
      const studentMiddleName = normalizeName(student.middle_name);
      
      // Check against existing students
      existingStudents.forEach(existing => {
        const existingLRN = existing.lrn.toString();
        const existingFirstName = normalizeName(existing.first_name);
        const existingLastName = normalizeName(existing.last_name);
        const existingMiddleName = normalizeName(existing.middle_name);
        
        // Exact LRN match
        if (studentLRN === existingLRN) {
          exactDuplicates.push({
            lrn: student.lrn,
            first_name: student.first_name,
            last_name: student.last_name,
            middle_name: student.middle_name,
            name: `${student.first_name} ${student.last_name}`,
            existingId: existing.id
          });
        }
        // Name match but different LRN (conflict)
        else {
          // Check if middle names match (exact or initial match)
          const middleNamesMatch = 
            studentMiddleName === existingMiddleName || // Exact match
            (studentMiddleName && existingMiddleName && 
             (studentMiddleName.charAt(0) === existingMiddleName.charAt(0))) || // Initial match (e.g., "B" matches "Brix")
            (!studentMiddleName && !existingMiddleName); // Both empty
          
          if (
            studentFirstName === existingFirstName &&
            studentLastName === existingLastName &&
            middleNamesMatch
          ) {
          console.log(`[STUDENT] Name conflict detected:`);
          console.log(`  SF1: ${student.first_name} ${student.middle_name} ${student.last_name} (LRN: ${student.lrn})`);
          console.log(`  DB:  ${existing.first_name} ${existing.middle_name} ${existing.last_name} (LRN: ${existing.lrn})`);
          console.log(`  Normalized - SF1: "${studentFirstName}" "${studentMiddleName}" "${studentLastName}"`);
          console.log(`  Normalized - DB:  "${existingFirstName}" "${existingMiddleName}" "${existingLastName}"`);
          
          nameConflicts.push({
            lrn: student.lrn,
            oldLrn: existing.lrn,
            first_name: student.first_name,
            last_name: student.last_name,
            middle_name: student.middle_name,
            name: `${student.first_name} ${student.last_name}`,
            existingId: existing.id
          });
          }
        }
      });
    });
    
    console.log(`[STUDENT] Found ${exactDuplicates.length} exact duplicates, ${nameConflicts.length} name conflicts`);
    
    return {
      success: true,
      exactDuplicates: exactDuplicates,
      nameConflicts: nameConflicts,
      count: exactDuplicates.length + nameConflicts.length
    };
    
  } catch (error) {
    console.error('[STUDENT] Error checking duplicates:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Bulk import students from SF1 file
async function bulkImportStudents(students, gradeLevel, section, nameConflicts = []) {
  try {
    console.log(`[STUDENT] Starting bulk import of ${students.length} students`);
    console.log(`[STUDENT] Grade Level: ${gradeLevel}, Section: ${section}`);
    console.log(`[STUDENT] Name conflicts to update: ${nameConflicts.length}`);
    
    // Get grade_section_id first
    const gradeSectionId = await getGradeSectionId(gradeLevel, section);
    
    if (!gradeSectionId) {
      throw new Error(`Invalid grade level (${gradeLevel}) or section (${section}) combination. Please ensure this grade-section exists in the system.`);
    }
    
    console.log(`[STUDENT] Found grade_section_id: ${gradeSectionId}`);
    
    // Create a map of name conflicts for quick lookup
    const conflictMap = new Map();
    nameConflicts.forEach(conflict => {
      const key = `${conflict.first_name}_${conflict.last_name}_${conflict.middle_name}`.toLowerCase();
      conflictMap.set(key, conflict);
    });
    
    const results = {
      success: [],
      updated: [],
      failed: [],
      duplicates: [],
      total: students.length
    };
    
    // Process each student
    for (const student of students) {
      try {
        // Check if this student is a name conflict (needs LRN update)
        const studentKey = `${student.first_name}_${student.last_name}_${student.middle_name}`.toLowerCase();
        const conflict = conflictMap.get(studentKey);
        
        if (conflict) {
          // Update existing student's LRN
          const updateQuery = `
            UPDATE students
            SET lrn = $1
            WHERE id = $2
            RETURNING id, first_name, last_name, lrn;
          `;
          
          const result = await query(updateQuery, [student.lrn, conflict.existingId]);
          
          results.updated.push({
            id: result.rows[0].id,
            name: `${result.rows[0].first_name} ${result.rows[0].last_name}`,
            oldLrn: conflict.oldLrn,
            newLrn: result.rows[0].lrn
          });
          
          console.log(`🔄 Updated LRN: ${result.rows[0].first_name} ${result.rows[0].last_name} (${conflict.oldLrn} → ${result.rows[0].lrn})`);
        } else {
          // Insert new student
          const studentData = {
            first_name: student.first_name || '',
            middle_name: student.middle_name || '',
            last_name: student.last_name || '',
            suffix: student.suffix || '',
            lrn: student.lrn,
            gender: student.gender || 'Male',
            grade_section_id: gradeSectionId,
            rfid: null // SF1 doesn't include RFID
          };
          
          const insertQuery = `
            INSERT INTO students (first_name, middle_name, last_name, suffix, lrn, grade_section_id, gender, rfid)
            VALUES (INITCAP($1), INITCAP($2), INITCAP($3), INITCAP($4), $5, $6, $7, $8)
            RETURNING id, first_name, last_name, lrn;
          `;
          
          const params = [
            studentData.first_name,
            studentData.middle_name,
            studentData.last_name,
            studentData.suffix,
            studentData.lrn,
            studentData.grade_section_id,
            studentData.gender,
            studentData.rfid
          ];
          
          const result = await query(insertQuery, params);
          
          results.success.push({
            id: result.rows[0].id,
            name: `${result.rows[0].first_name} ${result.rows[0].last_name}`,
            lrn: result.rows[0].lrn
          });
          
          console.log(`✅ Imported: ${result.rows[0].first_name} ${result.rows[0].last_name} (LRN: ${result.rows[0].lrn})`);
        }
        
      } catch (error) {
        // Handle duplicate LRN errors
        if (error.code === '23505' && error.constraint === 'students_lrn_key') {
          results.duplicates.push({
            lrn: student.lrn,
            name: `${student.first_name} ${student.last_name}`,
            error: 'LRN already exists'
          });
          console.log(`⚠️  Duplicate LRN: ${student.lrn} - ${student.first_name} ${student.last_name}`);
        } else {
          results.failed.push({
            lrn: student.lrn,
            name: `${student.first_name} ${student.last_name}`,
            error: error.message
          });
          console.error(`❌ Failed to import: ${student.first_name} ${student.last_name} - ${error.message}`);
        }
      }
    }
    
    console.log(`[STUDENT] Bulk import completed:`);
    console.log(`  ✅ Success: ${results.success.length}`);
    console.log(`  🔄 Updated: ${results.updated.length}`);
    console.log(`  ⚠️  Duplicates: ${results.duplicates.length}`);
    console.log(`  ❌ Failed: ${results.failed.length}`);
    
    return {
      success: true,
      results: results,
      summary: {
        total: results.total,
        imported: results.success.length,
        updated: results.updated.length,
        duplicates: results.duplicates.length,
        failed: results.failed.length
      }
    };
    
  } catch (error) {
    console.error('[STUDENT] Bulk import error:', error.message);
    throw new Error(`Bulk import failed: ${error.message}`);
  }
}

export {
  createStudent,
  saveStudent,
  getAllStudents,
  getStudentsPaginated,
  deleteStudent,
  updateStudent,
  getStudentById,
  getUniqueGradeLevels,
  getUniqueSections,
  getAllUniqueSections,
  getStudentsForSF2,
  checkDuplicateLRNs,
  bulkImportStudents
};
