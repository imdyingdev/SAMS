import { query } from './db-connection.js';

// Create a new student to the database (alias for saveStudent)
async function createStudent(studentData) {
  return saveStudent(studentData);
}

// Save a new student to the database
async function saveStudent(studentData) {

  const insertQuery = `
    INSERT INTO students (first_name, middle_name, last_name, suffix, lrn, grade_level, section, gender, rfid)
    VALUES (INITCAP($1), INITCAP($2), INITCAP($3), INITCAP($4), $5, $6, INITCAP($7), $8, $9)
    RETURNING *;
  `;

  const params = [
    studentData.first_name,
    studentData.middle_name,
    studentData.last_name,
    studentData.suffix,
    studentData.lrn,
    studentData.grade_level,
    studentData.section && studentData.section.trim() !== '' ? studentData.section : null,
    studentData.gender || 'Male', // Default to 'Male' if not provided
    studentData.rfid && studentData.rfid.trim() !== '' ? studentData.rfid : null
  ];

  try {
    const result = await query(insertQuery, params);
    return { success: true, data: result.rows[0] };
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
        id,
        first_name,
        middle_name,
        last_name,
        suffix,
        lrn,
        grade_level,
        section,
        gender,
        rfid,
        created_at
      FROM students
      ORDER BY
        grade_level ASC,
        last_name ASC,
        first_name ASC
    `);
    
    return result.rows;
    
  } catch (error) {
    console.error('[STUDENT] Error fetching students:', error.message);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Get paginated students with search and filters
async function getStudentsPaginated(page = 1, pageSize = 50, searchTerm = '', gradeFilter = '', rfidFilter = '') {
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
      if (gradeFilter === 'Kindergarten') {
        whereConditions.push(`grade_level = $${paramIndex}`);
        params.push('Kindergarten');
      } else {
        whereConditions.push(`grade_level = $${paramIndex}`);
        params.push(`Grade ${gradeFilter}`);
      }
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
      FROM students 
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params);
    const totalStudents = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalStudents / pageSize);
    
    // Get paginated results
    const dataQuery = `
      SELECT
        id,
        first_name,
        middle_name,
        last_name,
        suffix,
        lrn,
        grade_level,
        section,
        gender,
        rfid,
        created_at
      FROM students
      ${whereClause}
      ORDER BY
        grade_level ASC,
        last_name ASC,
        first_name ASC
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

    const result = await query(`
      UPDATE students
      SET
        first_name = INITCAP($1),
        middle_name = INITCAP($2),
        last_name = INITCAP($3),
        suffix = INITCAP($4),
        lrn = $5,
        grade_level = $6,
        section = INITCAP($7),
        gender = $8,
        rfid = $9
      WHERE id = $10
      RETURNING *
    `, [
      first_name,
      middle_name || null,
      last_name,
      suffix || null,
      lrn,
      grade_level,
      section && section.trim() !== '' ? section : null,
      gender || 'Male',
      rfid && rfid.trim() !== '' ? rfid : null,
      studentId
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Student not found or update failed');
    }
    
    return { success: true, data: result.rows[0] };
    
  } catch (error) {
    console.error('[STUDENT] Error:', error.message);
    throw new Error(`Failed to update student: ${error.message}`);
  }
}

// Get student by ID
async function getStudentById(studentId) {
  try {

    const result = await query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );

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
      FROM students
      WHERE grade_level IS NOT NULL
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
      SELECT DISTINCT section
      FROM students
      WHERE section IS NOT NULL AND grade_level = $1
      ORDER BY section ASC
    `, [gradeLevel]);

    return result.rows.map(row => row.section);
  } catch (error) {
    console.error('[STUDENT] Error fetching sections:', error.message);
    throw new Error(`Failed to fetch sections: ${error.message}`);
  }
}

// Get students by grade level and section for SF2 export
async function getStudentsForSF2(gradeLevel, section) {
  try {
    const result = await query(`
      SELECT
        id,
        first_name,
        middle_name,
        last_name,
        suffix,
        lrn,
        grade_level,
        section,
        gender,
        rfid,
        created_at
      FROM students
      WHERE grade_level = $1 AND section = $2
      ORDER BY last_name ASC, first_name ASC
    `, [gradeLevel, section]);

    return result.rows;
  } catch (error) {
    console.error('[STUDENT] Error fetching students for SF2:', error.message);
    throw new Error(`Failed to fetch students for SF2: ${error.message}`);
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
  getStudentsForSF2
};
