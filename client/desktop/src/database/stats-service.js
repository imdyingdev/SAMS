import { query } from './db-connection.js';

// Get student statistics by grade level for charts
async function getStudentStatsByGrade() {
  try {
    
    const result = await query(`
      SELECT 
        grade_level,
        COUNT(*) as student_count
      FROM students 
      GROUP BY grade_level
      ORDER BY 
        CASE 
          WHEN grade_level = 'Kindergarten' OR grade_level = 'K' THEN 0
          WHEN grade_level = 'Grade 1' OR grade_level = 'G1' THEN 1
          WHEN grade_level = 'Grade 2' OR grade_level = 'G2' THEN 2
          WHEN grade_level = 'Grade 3' OR grade_level = 'G3' THEN 3
          WHEN grade_level = 'Grade 4' OR grade_level = 'G4' THEN 4
          WHEN grade_level = 'Grade 5' OR grade_level = 'G5' THEN 5
          WHEN grade_level = 'Grade 6' OR grade_level = 'G6' THEN 6
          ELSE 999
        END
    `);
    
    // Create a complete dataset with all grade levels (K, G1-G6)
    const gradeOrder = ['K', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
    const statsMap = {};
    
    // Initialize all grades with 0
    gradeOrder.forEach(grade => {
      statsMap[grade] = 0;
    });
    
    // Fill in actual counts - map different grade formats to standard format
    result.rows.forEach(row => {
      const gradeLevel = row.grade_level;
      let mappedGrade = null;
      
      if (gradeLevel === 'Kindergarten' || gradeLevel === 'K') {
        mappedGrade = 'K';
      } else if (gradeLevel === 'Grade 1' || gradeLevel === 'G1') {
        mappedGrade = 'G1';
      } else if (gradeLevel === 'Grade 2' || gradeLevel === 'G2') {
        mappedGrade = 'G2';
      } else if (gradeLevel === 'Grade 3' || gradeLevel === 'G3') {
        mappedGrade = 'G3';
      } else if (gradeLevel === 'Grade 4' || gradeLevel === 'G4') {
        mappedGrade = 'G4';
      } else if (gradeLevel === 'Grade 5' || gradeLevel === 'G5') {
        mappedGrade = 'G5';
      } else if (gradeLevel === 'Grade 6' || gradeLevel === 'G6') {
        mappedGrade = 'G6';
      }
      
      if (mappedGrade && gradeOrder.includes(mappedGrade)) {
        statsMap[mappedGrade] = parseInt(row.student_count);
      }
    });
    
    // Convert to array format for chart
    const chartData = gradeOrder.map(grade => statsMap[grade]);
    
    return {
      labels: gradeOrder,
      data: chartData,
      totalStudents: chartData.reduce((sum, count) => sum + count, 0)
    };
    
  } catch (error) {
    console.error('[STATS] Error: fetching student statistics:', error);
    throw new Error(`Failed to fetch student statistics: ${error.message}`);
  }
}

// Get student statistics by gender for charts
async function getStudentStatsByGender() {
  try {
    
    const result = await query(`
      SELECT 
        gender,
        COUNT(*) as student_count
      FROM students 
      GROUP BY gender
      ORDER BY gender
    `);
    
    // Initialize gender stats
    const genderStats = {
      'Male': 0,
      'Female': 0
    };
    
    // Fill in actual counts
    result.rows.forEach(row => {
      const gender = row.gender;
      if (gender && (gender === 'Male' || gender === 'Female')) {
        genderStats[gender] = parseInt(row.student_count);
      }
    });
    
    // Convert to chart format
    const chartData = [
      { value: genderStats['Male'], name: 'Male' },
      { value: genderStats['Female'], name: 'Female' }
    ];
    
    return {
      data: chartData,
      totalStudents: genderStats['Male'] + genderStats['Female'],
      maleCount: genderStats['Male'],
      femaleCount: genderStats['Female']
    };
    
  } catch (error) {
    console.error('[STATS] Error: fetching gender statistics:', error);
    throw new Error(`Failed to fetch gender statistics: ${error.message}`);
  }
}

export {
  getStudentStatsByGrade,
  getStudentStatsByGender
};
