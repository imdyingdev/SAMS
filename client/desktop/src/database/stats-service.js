import { query } from './db-connection.js';

// Get student statistics by grade level for charts
async function getStudentStatsByGrade() {
  try {
    
    const result = await query(`
      SELECT 
        gs.grade_level,
        COUNT(s.id) as student_count
      FROM grade_sections gs
      LEFT JOIN students s ON s.grade_section_id = gs.id
      GROUP BY gs.grade_level
      ORDER BY gs.grade_level ASC
    `);
    
    // Create a complete dataset with all grade levels (G1-G6)
    const gradeOrder = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
    const statsMap = {};
    
    // Initialize all grades with 0
    gradeOrder.forEach(grade => {
      statsMap[grade] = 0;
    });
    
    // Fill in actual counts - map grade numbers to display format
    result.rows.forEach(row => {
      const gradeLevel = row.grade_level;
      let mappedGrade = null;
      
      if (gradeLevel === '1') {
        mappedGrade = 'G1';
      } else if (gradeLevel === '2') {
        mappedGrade = 'G2';
      } else if (gradeLevel === '3') {
        mappedGrade = 'G3';
      } else if (gradeLevel === '4') {
        mappedGrade = 'G4';
      } else if (gradeLevel === '5') {
        mappedGrade = 'G5';
      } else if (gradeLevel === '6') {
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
