import { query } from './db-connection.js';

// Save a new student to the database
async function saveStudent(studentData) {
  console.log('Attempting to save student:', studentData);

  const insertQuery = `
    INSERT INTO students (first_name, middle_name, last_name, suffix, lrn, grade_level, gender, rfid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const params = [
    studentData.first_name,
    studentData.middle_name,
    studentData.last_name,
    studentData.suffix,
    studentData.lrn,
    studentData.grade_level,
    studentData.gender || 'Male', // Default to 'Male' if not provided
    studentData.rfid && studentData.rfid.trim() !== '' ? studentData.rfid : null
  ];

  try {
    const result = await query(insertQuery, params);
    console.log('Student saved successfully:', result.rows[0]);
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
    console.log('📚 Fetching all students from database...');
    
    const result = await query(`
      SELECT 
        id,
        first_name,
        middle_name,
        last_name,
        suffix,
        lrn,
        grade_level,
        gender,
        rfid,
        created_at
      FROM students 
      ORDER BY 
        grade_level ASC,
        last_name ASC,
        first_name ASC
    `);
    
    console.log(`✅ Retrieved ${result.rows.length} students`);
    return result.rows;
    
  } catch (error) {
    console.error('🔥 Error fetching students:', error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Get paginated students with search and filters
async function getStudentsPaginated(page = 1, pageSize = 50, searchTerm = '', gradeFilter = '', rfidFilter = '') {
  try {
    console.log(`📚 Fetching students page ${page} (${pageSize} per page)...`);
    console.log(`🔍 Search: "${searchTerm}", Grade: "${gradeFilter}", RFID: "${rfidFilter}"`);
    
    const offset = (page - 1) * pageSize;
    
    // Build WHERE clause for filters
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;
    
    // Search term filter - ONLY first names that START WITH the search term
    if (searchTerm && searchTerm.trim()) {
      const searchTerm_lower = searchTerm.trim().toLowerCase();
      const startsWithPattern = `${searchTerm_lower}%`;
      
      whereConditions.push(`LOWER(first_name) LIKE $${paramIndex}`);
      params.push(startsWithPattern);
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
    
    console.log(`✅ Retrieved ${dataResult.rows.length} students (page ${page}/${totalPages}, total: ${totalStudents})`);
    return result;
    
  } catch (error) {
    console.error('🔥 Error fetching paginated students:', error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Delete a student by ID
async function deleteStudent(studentId) {
  try {
    console.log(`🗑️ Deleting student with ID: ${studentId}`);
    
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
    
    console.log(`✅ Successfully deleted student: ${studentName}`);
    return { success: true, deletedStudent: deleteResult.rows[0] };
    
  } catch (error) {
    console.error('🔥 Error deleting student:', error);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}

// Update a student's information
async function updateStudent(studentId, studentData) {
  try {
    console.log(`✏️ Updating student with ID: ${studentId}`);
    
    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      lrn,
      grade_level,
      gender,
      rfid
    } = studentData;
    
    const result = await query(`
      UPDATE students 
      SET 
        first_name = $1,
        middle_name = $2,
        last_name = $3,
        suffix = $4,
        lrn = $5,
        grade_level = $6,
        gender = $7,
        rfid = $8
      WHERE id = $9
      RETURNING *
    `, [
      first_name,
      middle_name || null,
      last_name,
      suffix || null,
      lrn,
      grade_level,
      gender || 'Male',
      rfid && rfid.trim() !== '' ? rfid : null,
      studentId
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Student not found or update failed');
    }
    
    console.log(`✅ Successfully updated student: ${first_name} ${last_name}`);
    return { success: true, data: result.rows[0] };
    
  } catch (error) {
    console.error('🔥 Error updating student:', error);
    throw new Error(`Failed to update student: ${error.message}`);
  }
}

// Get student by ID
async function getStudentById(studentId) {
  try {
    console.log(`🔍 Fetching student with ID: ${studentId}`);
    
    const result = await query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    console.log(`✅ Found student: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('🔥 Error fetching student:', error);
    throw new Error(`Failed to fetch student: ${error.message}`);
  }
}

export {
  saveStudent,
  getAllStudents,
  getStudentsPaginated,
  deleteStudent,
  updateStudent,
  getStudentById
};
