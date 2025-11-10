import ExcelJS from 'exceljs';

// Configuration based on SF1 format
const CONFIG = {
  EXPECTED_SCHOOL_ID: '109481',
  SCHOOL_NAME: 'AMPID 1 ELEMENTARY SCHOOL',
  STUDENT_DATA_START_ROW: 7,
  CELLS: {
    SCHOOL_ID: 'F3',
    GRADE_LEVEL: 'AE4',
    SECTION: 'AM4',
  }
};

/**
 * Get cell value from worksheet (ExcelJS format)
 */
function getCellValue(sheet, cellAddress) {
  const cell = sheet.getCell(cellAddress);
  return cell ? cell.value : null;
}

/**
 * Extract student data from a row
 */
function extractStudentFromRow(sheet, rowNum) {
  // LRN is in column A
  const lrnCell = `A${rowNum}`;
  const lrn = getCellValue(sheet, lrnCell);
  
  // If LRN is empty or equals school ID, we've reached the end
  if (!lrn || lrn.toString() === CONFIG.EXPECTED_SCHOOL_ID) {
    return null;
  }
  
  // Validate that LRN is numeric (not text/header)
  const lrnString = lrn.toString().trim();
  if (!/^\d+$/.test(lrnString)) {
    // LRN contains non-numeric characters, skip this row
    console.log(`Skipping row ${rowNum}: Invalid LRN format "${lrnString}"`);
    return null;
  }
  
  // Name is in column C (format: "LAST,FIRST, MIDDLE")
  const nameCell = `C${rowNum}`;
  const fullName = getCellValue(sheet, nameCell);
  
  // Gender is in column G
  const genderCell = `G${rowNum}`;
  const gender = getCellValue(sheet, genderCell);
  
  // Validate gender is M or F (not text/header)
  const genderString = gender ? gender.toString().trim().toUpperCase() : '';
  if (!['M', 'F', 'MALE', 'FEMALE'].includes(genderString)) {
    // Invalid gender, skip this row
    console.log(`Skipping row ${rowNum}: Invalid gender "${genderString}"`);
    return null;
  }
  
  // Only return if we have valid data
  if (lrn && fullName && gender) {
    // Parse the name format: "LAST,FIRST, MIDDLE"
    const nameParts = fullName.toString().split(',').map(part => part.trim());
    let lastName = '';
    let firstName = '';
    let middleName = '';
    
    if (nameParts.length >= 2) {
      lastName = nameParts[0];
      firstName = nameParts[1];
      middleName = nameParts.length > 2 ? nameParts[2] : '';
    } else {
      // Fallback if name format is different
      lastName = fullName.toString();
    }
    
    return {
      lrn: lrn.toString(),
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      suffix: '',
      gender: gender.toString().toUpperCase() === 'M' ? 'Male' : 'Female'
    };
  }
  
  return null;
}

/**
 * Main extraction function
 */
export async function extractSF1Data(filePath) {
  try {
    // Read the Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    const sheetName = sheet.name;
    
    console.log(`Reading SF1 sheet: ${sheetName}`);
    
    // Extract header information
    const schoolId = getCellValue(sheet, CONFIG.CELLS.SCHOOL_ID);
    const gradeLevel = getCellValue(sheet, CONFIG.CELLS.GRADE_LEVEL);
    const section = getCellValue(sheet, CONFIG.CELLS.SECTION);
    
    console.log(`School ID: ${schoolId}`);
    console.log(`Grade Level: ${gradeLevel}`);
    console.log(`Section: ${section}`);
    
    // Validate school ID
    if (schoolId?.toString() !== CONFIG.EXPECTED_SCHOOL_ID) {
      throw new Error(
        `Invalid School ID: ${schoolId}. Expected ${CONFIG.EXPECTED_SCHOOL_ID} (${CONFIG.SCHOOL_NAME}). ` +
        `Please ensure the SF1 file is properly aligned and is from the correct school.`
      );
    }
    
    // Extract grade number from "Grade X" format
    const gradeMatch = gradeLevel?.toString().match(/Grade\s+(\d+)/i);
    const gradeNum = gradeMatch ? gradeMatch[1] : gradeLevel?.toString();
    
    if (!gradeNum) {
      throw new Error('Could not extract grade level from SF1 file.');
    }
    
    if (!section || section.toString().trim() === '') {
      throw new Error('Could not extract section from SF1 file.');
    }
    
    // Extract all students starting from row 7
    const students = [];
    let rowNum = CONFIG.STUDENT_DATA_START_ROW;
    let consecutiveEmpty = 0;
    
    while (consecutiveEmpty < 5) {
      const student = extractStudentFromRow(sheet, rowNum);
      
      if (student) {
        students.push(student);
        consecutiveEmpty = 0;
        console.log(`Row ${rowNum}: ${student.lrn} - ${student.last_name}, ${student.first_name} (${student.gender})`);
      } else {
        consecutiveEmpty++;
      }
      
      rowNum++;
      
      // Safety limit to prevent infinite loops
      if (rowNum > 1000) {
        console.warn('Reached row limit of 1000, stopping extraction');
        break;
      }
    }
    
    if (students.length === 0) {
      throw new Error('No student data found in the SF1 file. Please check the file format.');
    }
    
    // Build output data
    const output = {
      schoolId: schoolId?.toString(),
      gradeLevel: gradeNum.toString(),
      section: section.toString().trim(),
      totalStudents: students.length,
      students: students
    };
    
    console.log(`✅ Successfully extracted ${students.length} students from SF1`);
    return { success: true, data: output };
    
  } catch (error) {
    console.error('❌ Error extracting SF1 data:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Extract SF1 data from buffer (for file uploads)
 */
export async function extractSF1DataFromBuffer(buffer) {
  try {
    // Read the Excel file from buffer using ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    const sheetName = sheet.name;
    
    console.log(`Reading SF1 sheet: ${sheetName}`);
    
    // Extract header information
    const schoolId = getCellValue(sheet, CONFIG.CELLS.SCHOOL_ID);
    const gradeLevel = getCellValue(sheet, CONFIG.CELLS.GRADE_LEVEL);
    const section = getCellValue(sheet, CONFIG.CELLS.SECTION);
    
    console.log(`School ID: ${schoolId}`);
    console.log(`Grade Level: ${gradeLevel}`);
    console.log(`Section: ${section}`);
    
    // Validate school ID
    if (schoolId?.toString() !== CONFIG.EXPECTED_SCHOOL_ID) {
      throw new Error(
        `Invalid School ID: ${schoolId}. Expected ${CONFIG.EXPECTED_SCHOOL_ID} (${CONFIG.SCHOOL_NAME}). ` +
        ` Please confirm that the SF1 file belongs to the correct institution.`
      );
    }
    
    // Extract grade number from "Grade X" format
    const gradeMatch = gradeLevel?.toString().match(/Grade\s+(\d+)/i);
    const gradeNum = gradeMatch ? gradeMatch[1] : gradeLevel?.toString();
    
    if (!gradeNum) {
      throw new Error('Could not extract grade level from SF1 file.');
    }
    
    if (!section || section.toString().trim() === '') {
      throw new Error('Could not extract section from SF1 file.');
    }
    
    // Extract all students starting from row 7
    const students = [];
    let rowNum = CONFIG.STUDENT_DATA_START_ROW;
    let consecutiveEmpty = 0;
    
    while (consecutiveEmpty < 5) {
      const student = extractStudentFromRow(sheet, rowNum);
      
      if (student) {
        students.push(student);
        consecutiveEmpty = 0;
        console.log(`Row ${rowNum}: ${student.lrn} - ${student.last_name}, ${student.first_name} (${student.gender})`);
      } else {
        consecutiveEmpty++;
      }
      
      rowNum++;
      
      // Safety limit
      if (rowNum > 1000) {
        console.warn('Reached row limit of 1000, stopping extraction');
        break;
      }
    }
    
    if (students.length === 0) {
      throw new Error('No student data found in the SF1 file. Please check the file format.');
    }
    
    // Build output data
    const output = {
      schoolId: schoolId?.toString(),
      gradeLevel: gradeNum.toString(),
      section: section.toString().trim(),
      totalStudents: students.length,
      students: students
    };
    
    console.log(`✅ Successfully extracted ${students.length} students from SF1`);
    return { success: true, data: output };
    
  } catch (error) {
    console.error('❌ Error extracting SF1 data:', error.message);
    return { success: false, error: error.message };
  }
}
