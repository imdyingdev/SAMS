import { query } from './db-connection.js';

// Helper function to get grade_section_id from grade_level and section_name
async function getGradeSectionId(gradeLevel, sectionName) {
  if (!gradeLevel || !sectionName) {
    return null;
  }
  
  const cleanGrade = gradeLevel.replace(/^Grade\s*/i, '').trim();
  
  try {
    const result = await query(`
      SELECT id FROM grade_sections
      WHERE grade_level = $1 
        AND LOWER(section_name) = LOWER($2)
      LIMIT 1
    `, [cleanGrade, sectionName.trim()]);
    
    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    console.error('[PROMOTION] Error getting grade_section_id:', error.message);
    return null;
  }
}

// Promote individual student
async function promoteStudent(studentId, targetGradeLevel, targetSection, promotedBy, notes = null) {
  // Validate promotedBy parameter
  if (!promotedBy) {
    throw new Error('promotedBy parameter is required');
  }

  try {
    // Get current student data
    const studentResult = await query(`
      SELECT s.*, gs.grade_level, gs.section_name, gs.id as current_grade_section_id
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE s.id = $1
    `, [studentId]);
    
    if (studentResult.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    const student = studentResult.rows[0];
    
    // Get target grade_section_id
    const targetGradeSectionId = await getGradeSectionId(targetGradeLevel, targetSection);
    if (!targetGradeSectionId) {
      throw new Error(`Invalid target grade/section combination: Grade ${targetGradeLevel} - ${targetSection}`);
    }
    
    // Check if already in target grade/section
    if (student.current_grade_section_id === targetGradeSectionId) {
      throw new Error('Student is already in the target grade/section');
    }

    // Validate grade progression (target must be higher than current)
    const currentGradeNum = parseInt(student.grade_level);
    const targetGradeNum = parseInt(targetGradeLevel.replace(/^Grade\s*/i, '').trim());
    if (isNaN(currentGradeNum) || isNaN(targetGradeNum) || targetGradeNum <= currentGradeNum) {
      throw new Error(`Invalid grade progression: Cannot promote from Grade ${student.grade_level} to Grade ${targetGradeLevel}`);
    }
    
    // Update student's grade_section_id
    await query(`
      UPDATE students
      SET grade_section_id = $1
      WHERE id = $2
    `, [targetGradeSectionId, studentId]);
    
    // Record promotion history
    await query(`
      INSERT INTO student_promotion_history 
      (student_id, from_grade_section_id, to_grade_section_id, from_grade_level, to_grade_level, 
       from_section, to_section, promoted_by, promotion_type, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'individual', $9)
    `, [
      studentId,
      student.current_grade_section_id,
      targetGradeSectionId,
      student.grade_level,
      targetGradeLevel,
      student.section_name,
      targetSection,
      promotedBy,
      notes
    ]);
    
    return { 
      success: true, 
      message: `Student promoted from Grade ${student.grade_level} ${student.section_name} to Grade ${targetGradeLevel} ${targetSection}` 
    };
    
  } catch (error) {
    console.error('[PROMOTION] Error promoting student:', error.message);
    throw error;
  }
}

// Promote students by grade level
async function promoteStudentsByGrade(currentGrade, targetGrade, sectionAssignment, promotedBy) {
  // Validate promotedBy parameter
  if (!promotedBy) {
    throw new Error('promotedBy parameter is required');
  }

  try {
    // Get all students in current grade
    const studentsResult = await query(`
      SELECT s.id, s.first_name, s.last_name, gs.grade_level, gs.section_name, gs.id as current_grade_section_id
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE gs.grade_level = $1 AND s.status = 'active'
    `, [currentGrade]);
    
    if (studentsResult.rows.length === 0) {
      return { success: true, message: `No students found in Grade ${currentGrade}`, promotedCount: 0 };
    }
    
    let promotedCount = 0;
    let errors = [];
    
    for (const student of studentsResult.rows) {
      try {
        let targetSection;
        
        if (sectionAssignment === 'auto') {
          // Try to keep same section name
          const sectionExists = await query(`
            SELECT id FROM grade_sections
            WHERE grade_level = $1 AND section_name = $2
            LIMIT 1
          `, [targetGrade, student.section_name]);
          
          if (sectionExists.rows.length > 0) {
            targetSection = student.section_name;
          } else {
            // Get first available section in target grade
            const firstSection = await query(`
              SELECT section_name FROM grade_sections
              WHERE grade_level = $1
              ORDER BY section_name
              LIMIT 1
            `, [targetGrade]);
            
            if (firstSection.rows.length === 0) {
              throw new Error(`No sections available in Grade ${targetGrade}`);
            }
            targetSection = firstSection.rows[0].section_name;
          }
        } else {
          // Manual assignment - get first available section
          const firstSection = await query(`
            SELECT section_name FROM grade_sections
            WHERE grade_level = $1
            ORDER BY section_name
            LIMIT 1
          `, [targetGrade]);
          
          if (firstSection.rows.length === 0) {
            throw new Error(`No sections available in Grade ${targetGrade}`);
          }
          targetSection = firstSection.rows[0].section_name;
        }
        
        const result = await promoteStudent(
          student.id, 
          targetGrade, 
          targetSection, 
          promotedBy, 
          `Batch promotion from Grade ${currentGrade}`
        );
        
        if (result.success) promotedCount++;
        
      } catch (error) {
        errors.push({
          student: `${student.first_name} ${student.last_name}`,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `Promoted ${promotedCount} students from Grade ${currentGrade} to Grade ${targetGrade}`,
      promotedCount,
      totalStudents: studentsResult.rows.length,
      errors
    };
    
  } catch (error) {
    console.error('[PROMOTION] Error in batch grade promotion:', error.message);
    throw error;
  }
}

// Promote students by section
async function promoteStudentsBySection(gradeLevel, currentSection, targetSection, promotedBy) {
  // Validate promotedBy parameter
  if (!promotedBy) {
    throw new Error('promotedBy parameter is required');
  }

  try {
    const studentsResult = await query(`
      SELECT s.id, s.first_name, s.last_name, gs.grade_level, gs.section_name, gs.id as current_grade_section_id
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE gs.grade_level = $1 
        AND LOWER(gs.section_name) = LOWER($2)
        AND s.status = 'active'
    `, [gradeLevel, currentSection]);
    
    if (studentsResult.rows.length === 0) {
      return { success: true, message: `No students found in Grade ${gradeLevel} - ${currentSection}`, promotedCount: 0 };
    }
    
    let promotedCount = 0;
    let errors = [];
    
    for (const student of studentsResult.rows) {
      try {
        const result = await promoteStudent(
          student.id,
          gradeLevel,
          targetSection,
          promotedBy,
          `Batch section promotion from ${currentSection} to ${targetSection}`
        );
        
        if (result.success) promotedCount++;
        
      } catch (error) {
        errors.push({
          student: `${student.first_name} ${student.last_name}`,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `Promoted ${promotedCount} students from ${currentSection} to ${targetSection}`,
      promotedCount,
      totalStudents: studentsResult.rows.length,
      errors
    };
    
  } catch (error) {
    console.error('[PROMOTION] Error in batch section promotion:', error.message);
    throw error;
  }
}

// Graduate individual student
async function graduateStudent(studentId, graduatedBy, notes = null) {
  // Validate graduatedBy parameter
  if (!graduatedBy) {
    throw new Error('graduatedBy parameter is required');
  }

  try {
    // Get student data
    const studentResult = await query(`
      SELECT s.*, gs.grade_level, gs.section_name, gs.id as current_grade_section_id
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE s.id = $1
    `, [studentId]);
    
    if (studentResult.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    const student = studentResult.rows[0];

    // Validate that student is in Grade 6
    const studentGradeNum = parseInt(student.grade_level);
    if (isNaN(studentGradeNum) || studentGradeNum !== 6) {
      throw new Error(`Student can only graduate from Grade 6. Current grade: ${student.grade_level}`);
    }

    // Check for duplicate LRN in graduated_students
    if (student.lrn) {
      const duplicateCheck = await query(`
        SELECT id FROM graduated_students WHERE lrn = $1 LIMIT 1
      `, [student.lrn]);
      if (duplicateCheck.rows.length > 0) {
        throw new Error('A student with this LRN has already graduated');
      }
    }

    // Create archive record
    await query(`
      INSERT INTO graduated_students 
      (id, first_name, middle_name, last_name, suffix, lrn, gender, rfid, 
       final_grade_section_id, final_grade_level, final_section, graduation_date, graduated_by, original_student_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13)
    `, [
      student.id,
      student.first_name,
      student.middle_name,
      student.last_name,
      student.suffix,
      student.lrn,
      student.gender,
      student.rfid,
      student.current_grade_section_id,
      student.grade_level,
      student.section_name,
      graduatedBy,
      studentId
    ]);
    
    // Update student status
    await query(`
      UPDATE students
      SET status = 'graduated'
      WHERE id = $1
    `, [studentId]);
    
    // Record promotion history
    await query(`
      INSERT INTO student_promotion_history 
      (student_id, from_grade_section_id, to_grade_section_id, from_grade_level, to_grade_level, 
       from_section, to_section, promoted_by, promotion_type, notes)
      VALUES ($1, $2, NULL, $3, 'GRADUATED', $4, NULL, $5, 'graduation', $6)
    `, [
      studentId,
      student.current_grade_section_id,
      student.grade_level,
      student.section_name,
      graduatedBy,
      notes
    ]);
    
    return { 
      success: true, 
      message: `Student ${student.first_name} ${student.last_name} graduated from Grade ${student.grade_level}` 
    };
    
  } catch (error) {
    console.error('[PROMOTION] Error graduating student:', error.message);
    throw error;
  }
}

// Graduate all Grade 6 students
async function graduateGrade6Students(graduatedBy) {
  // Validate graduatedBy parameter
  if (!graduatedBy) {
    throw new Error('graduatedBy parameter is required');
  }

  try {
    const studentsResult = await query(`
      SELECT s.id, s.first_name, s.last_name, gs.grade_level, gs.section_name, gs.id as current_grade_section_id
      FROM students s
      JOIN grade_sections gs ON s.grade_section_id = gs.id
      WHERE gs.grade_level = '6' AND s.status = 'active'
    `);
    
    if (studentsResult.rows.length === 0) {
      return { success: true, message: 'No Grade 6 students found to graduate', graduatedCount: 0 };
    }
    
    let graduatedCount = 0;
    let errors = [];
    
    for (const student of studentsResult.rows) {
      try {
        const result = await graduateStudent(student.id, graduatedBy, 'Batch Grade 6 graduation');
        if (result.success) graduatedCount++;
      } catch (error) {
        errors.push({
          student: `${student.first_name} ${student.last_name}`,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `Graduated ${graduatedCount} Grade 6 students`,
      graduatedCount,
      totalStudents: studentsResult.rows.length,
      errors
    };
    
  } catch (error) {
    console.error('[PROMOTION] Error in batch graduation:', error.message);
    throw error;
  }
}

// Get promotion history for a student
async function getPromotionHistory(studentId) {
  try {
    const result = await query(`
      SELECT sph.*, 
        au.username as promoted_by_username
      FROM student_promotion_history sph
      LEFT JOIN admin_users au ON sph.promoted_by = au.id
      WHERE sph.student_id = $1
      ORDER BY sph.promotion_date DESC
    `, [studentId]);
    
    return result.rows;
  } catch (error) {
    console.error('[PROMOTION] Error getting promotion history:', error.message);
    throw error;
  }
}

// Get promotion statistics
async function getPromotionStats() {
  try {
    const stats = await query(`
      SELECT 
        promotion_type,
        COUNT(*) as count,
        DATE(promotion_date) as date
      FROM student_promotion_history
      GROUP BY promotion_type, DATE(promotion_date)
      ORDER BY date DESC, promotion_type
    `);
    
    const graduationStats = await query(`
      SELECT 
        COUNT(*) as total_graduated,
        COUNT(DISTINCT DATE(graduation_date)) as graduation_days
      FROM graduated_students
    `);
    
    return {
      promotionStats: stats.rows,
      graduationStats: graduationStats.rows[0]
    };
  } catch (error) {
    console.error('[PROMOTION] Error getting promotion stats:', error.message);
    throw error;
  }
}

export {
  promoteStudent,
  promoteStudentsByGrade,
  promoteStudentsBySection,
  graduateStudent,
  graduateGrade6Students,
  getPromotionHistory,
  getPromotionStats
};