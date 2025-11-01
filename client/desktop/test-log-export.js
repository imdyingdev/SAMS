import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to convert column number to letter (1 = A, 27 = AA, etc.)
function getColumnLetter(col) {
  let letter = '';
  while (col > 0) {
    const remainder = (col - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

async function testLogExport() {
  try {
    console.log('Testing log export...');

    // Path to the source xlsx file
    const sourceFilePath = path.join(__dirname, 'public/assets/sf2.xlsx');
    console.log('Source file:', sourceFilePath);

    // Output path for testing
    const outputPath = path.join(__dirname, 'test-output.xlsx');
    console.log('Output file:', outputPath);

    // Load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourceFilePath);
    console.log('✓ File loaded successfully');

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];
    console.log('✓ Worksheet loaded:', worksheet.name);
    console.log('  Row count before modification:', worksheet.rowCount);

    // Test data: 2 male students and 2 female students (surname, first name, middle name)
    const maleStudents = [
      { last_name: 'GRAFE', first_name: 'JOHN', middle_name: 'RAYMOND' },
      { last_name: 'SANTOS', first_name: 'PEDRO', middle_name: 'GARCIA' }
    ];

    const femaleStudents = [
      { last_name: 'GARCIA', first_name: 'MARIA', middle_name: 'SANTOS' },
      { last_name: 'REYES', first_name: 'ANA', middle_name: 'LOPEZ' }
    ];

    // Metadata information
    const month = 'September';
    const schoolId = '104922';
    const schoolName = 'AMPID ELEMENTARY SCHOOL';
    const gradeLevel = 'MT MAKILINGS';
    const sectionName = '1'; // Number or 'K' for kindergarten

    console.log('\n📝 Month:', month);
    console.log('📝 School ID:', schoolId);
    console.log('📝 School Name:', schoolName);
    console.log('📝 Grade Level:', gradeLevel);
    console.log('📝 Section Name:', sectionName);
    console.log('📝 Processing male students:', maleStudents.length, 'males');
    console.log('📝 Processing female students:', femaleStudents.length, 'females');

    // Set month in AA6
    const cellAA6 = worksheet.getCell('AA6');
    cellAA6.value = month;
    console.log(`✓ Set AA6 (Month) to "${month}"`);

    // Set school ID in G6
    const cellG6 = worksheet.getCell('G6');
    cellG6.value = schoolId;
    console.log(`✓ Set G6 (School ID) to "${schoolId}"`);

    // Set school name in G7
    const cellG7 = worksheet.getCell('G7');
    cellG7.value = schoolName;
    console.log(`✓ Set G7 (School Name) to "${schoolName}"`);

    // Set section name in AA7
    const cellAA7 = worksheet.getCell('AA7');
    cellAA7.value = sectionName;
    console.log(`✓ Set AA7 (Section Name) to "${sectionName}"`);

    // Set grade level in AF7
    const cellAF7 = worksheet.getCell('AF7');
    cellAF7.value = gradeLevel;
    console.log(`✓ Set AF7 (Grade Level) to "${gradeLevel}"`);

    console.log('\n📝 Processing students...');

    // Process male students (starting at row 13)
    const maleStartRow = 13;
    maleStudents.forEach((student, index) => {
      const targetRow = maleStartRow + index;
      const formattedName = `${student.last_name}, ${student.first_name}, ${student.middle_name}`;

      console.log(`\n--- Processing Male Student ${index + 1} ---`);
      console.log(`  Target row: ${targetRow}`);

      // Set the name in column B
      const cellB = worksheet.getCell(`B${targetRow}`);
      cellB.value = formattedName;
      cellB.alignment = { vertical: 'middle', horizontal: 'left' };
      cellB.font = { size: 11 };

      console.log(`  ✓ Set B${targetRow} value to "${formattedName}"`);
    });

    // Process female students (starting at row 64 in original template)
    const femaleStartRow = 64;
    femaleStudents.forEach((student, index) => {
      const targetRow = femaleStartRow + index;
      const formattedName = `${student.last_name}, ${student.first_name}, ${student.middle_name}`;

      console.log(`\n--- Processing Female Student ${index + 1} ---`);
      console.log(`  Target row: ${targetRow}`);

      // Set the name in column B
      const cellB = worksheet.getCell(`B${targetRow}`);
      cellB.value = formattedName;
      cellB.alignment = { vertical: 'middle', horizontal: 'left' };
      cellB.font = { size: 11 };

      console.log(`  ✓ Set B${targetRow} value to "${formattedName}"`);
    });

    // **FIX: Convert all shared formulas to regular formulas BEFORE any modifications**
    console.log('\n🔧 Converting shared formulas to regular formulas...');
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (cell.type === ExcelJS.ValueType.Formula) {
          const cellModel = cell.model;
          if (cellModel.sharedFormula !== undefined) {
            // Convert shared formula to regular formula
            const formula = cell.formula;
            cell.value = { formula: formula };
            console.log(`  Converted cell ${cell.address} from shared to regular formula`);
          }
        }
      });
    });
    console.log('✓ Formula conversion complete');

    // **INSTEAD OF DELETING: Hide extra male student rows**
    if (maleStudents.length < 50) {
      console.log(`\n📝 Male students: ${maleStudents.length}/50, hiding extra rows...`);

      const startHideRow = maleStartRow + maleStudents.length;
      const endHideRow = maleStartRow + 50 - 1; // 13 + 49 = 62

      console.log(`  Hiding rows ${startHideRow} to ${endHideRow}`);

      for (let r = startHideRow; r <= endHideRow; r++) {
        const row = worksheet.getRow(r);
        row.hidden = true;
      }

      console.log('  ✓ Hidden extra male student rows');
    }

    // **INSTEAD OF DELETING: Hide extra female student rows**
    if (femaleStudents.length < 50) {
      console.log(`\n📝 Female students: ${femaleStudents.length}/50, hiding extra rows...`);

      const startHideRow = femaleStartRow + femaleStudents.length;
      const endHideRow = femaleStartRow + 50 - 1; // 64 + 49 = 113

      console.log(`  Hiding rows ${startHideRow} to ${endHideRow}`);

      for (let r = startHideRow; r <= endHideRow; r++) {
        const row = worksheet.getRow(r);
        row.hidden = true;
      }

      console.log('  ✓ Hidden extra female student rows');
    }

    // Calculate row positions (with original template structure)
    const maleEndRow = maleStartRow + maleStudents.length - 1; // 14
    const maleTotalRow = 63; // Fixed position in template
    const femaleEndRow = femaleStartRow + femaleStudents.length - 1; // 65
    const femaleTotalRow = 114; // Fixed position in template
    const combinedTotalRow = 115; // Fixed position in template

    console.log('\n📊 Row Layout (template positions):');
    console.log(`  Male: rows ${maleStartRow}-${maleEndRow}, total at ${maleTotalRow}`);
    console.log(`  Female: rows ${femaleStartRow}-${femaleEndRow}, total at ${femaleTotalRow}`);
    console.log(`  Combined Total: row ${combinedTotalRow}`);

    // **UPDATE: Male total formulas**
    console.log(`\n🔧 Updating male total formulas in row ${maleTotalRow}...`);
    console.log(`  Male student range: B${maleStartRow}:B${maleEndRow}`);
    
    // Update formulas for columns G to AE (columns 7 to 31)
    for (let col = 7; col <= 31; col++) {
      const cell = worksheet.getCell(maleTotalRow, col);
      const colLetter = getColumnLetter(col);
      
      const formula = `IF(${colLetter}10="","",COUNTA($B$${maleStartRow}:$B$${maleEndRow})-(COUNTIF(${colLetter}${maleStartRow}:${colLetter}${maleEndRow},"x")*1 + COUNTIF(${colLetter}${maleStartRow}:${colLetter}${maleEndRow},"h")*0.5))`;
      
      cell.value = { formula: formula };
      console.log(`  ✓ Updated ${cell.address}: ${formula}`);
    }

    // Update AF and AG for male total (SUM formulas)
    const cellAF_MaleTotal = worksheet.getCell(`AF${maleTotalRow}`);
    cellAF_MaleTotal.value = { formula: `SUM(AF${maleStartRow}:AF${maleEndRow})` };
    console.log(`  ✓ Updated AF${maleTotalRow}: =SUM(AF${maleStartRow}:AF${maleEndRow})`);

    const cellAG_MaleTotal = worksheet.getCell(`AG${maleTotalRow}`);
    cellAG_MaleTotal.value = { formula: `SUM(AG${maleStartRow}:AG${maleEndRow})` };
    console.log(`  ✓ Updated AG${maleTotalRow}: =SUM(AG${maleStartRow}:AG${maleEndRow})`);

    // **UPDATE: Female total formulas**
    console.log(`\n🔧 Updating female total formulas in row ${femaleTotalRow}...`);
    console.log(`  Female student range: B${femaleStartRow}:B${femaleEndRow}`);
    
    // Update formulas for columns G to AE (columns 7 to 31)
    for (let col = 7; col <= 31; col++) {
      const cell = worksheet.getCell(femaleTotalRow, col);
      const colLetter = getColumnLetter(col);
      
      const formula = `IF(${colLetter}10="","",COUNTA($B$${femaleStartRow}:$B$${femaleEndRow})-(COUNTIF(${colLetter}${femaleStartRow}:${colLetter}${femaleEndRow},"x")*1 + COUNTIF(${colLetter}${femaleStartRow}:${colLetter}${femaleEndRow},"h")*0.5))`;
      
      cell.value = { formula: formula };
      console.log(`  ✓ Updated ${cell.address}: ${formula}`);
    }

    // Update AF and AG for female total (SUM formulas)
    const cellAF_FemaleTotal = worksheet.getCell(`AF${femaleTotalRow}`);
    cellAF_FemaleTotal.value = { formula: `SUM(AF${femaleStartRow}:AF${femaleEndRow})` };
    console.log(`  ✓ Updated AF${femaleTotalRow}: =SUM(AF${femaleStartRow}:AF${femaleEndRow})`);

    const cellAG_FemaleTotal = worksheet.getCell(`AG${femaleTotalRow}`);
    cellAG_FemaleTotal.value = { formula: `SUM(AG${femaleStartRow}:AG${femaleEndRow})` };
    console.log(`  ✓ Updated AG${femaleTotalRow}: =SUM(AG${femaleStartRow}:AG${femaleEndRow})`);

    // **UPDATE: Combined Total formulas**
    console.log(`\n🔧 Updating combined total formulas in row ${combinedTotalRow}...`);
    
    const cellAF_CombinedTotal = worksheet.getCell(`AF${combinedTotalRow}`);
    cellAF_CombinedTotal.value = { formula: `AF${maleTotalRow}+AF${femaleTotalRow}` };
    console.log(`  ✓ Updated AF${combinedTotalRow}: =AF${maleTotalRow}+AF${femaleTotalRow}`);

    const cellAG_CombinedTotal = worksheet.getCell(`AG${combinedTotalRow}`);
    cellAG_CombinedTotal.value = { formula: `AG${maleTotalRow}+AG${femaleTotalRow}` };
    console.log(`  ✓ Updated AG${combinedTotalRow}: =AG${maleTotalRow}+AG${femaleTotalRow}`);

    // **NEW: Set number of male students in AK119:AK120**
    console.log(`\n🔧 Setting student counts...`);
    
    const cellAK119 = worksheet.getCell('AK119');
    cellAK119.value = maleStudents.length;
    console.log(`  ✓ Set AK119 (Male count): ${maleStudents.length}`);
    
    const cellAK120 = worksheet.getCell('AK120');
    cellAK120.value = maleStudents.length;
    console.log(`  ✓ Set AK120 (Male count): ${maleStudents.length}`);

    // **NEW: Set number of female students in AL119:AL120**
    const cellAL119 = worksheet.getCell('AL119');
    cellAL119.value = femaleStudents.length;
    console.log(`  ✓ Set AL119 (Female count): ${femaleStudents.length}`);
    
    const cellAL120 = worksheet.getCell('AL120');
    cellAL120.value = femaleStudents.length;
    console.log(`  ✓ Set AL120 (Female count): ${femaleStudents.length}`);

    // Save the modified file
    await workbook.xlsx.writeFile(outputPath);
    console.log('✓ File saved successfully to:', outputPath);

    console.log('\n✅ Test completed successfully!');
    console.log('Check the test-output.xlsx file to verify the changes');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testLogExport();