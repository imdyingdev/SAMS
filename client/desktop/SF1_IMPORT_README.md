# SF1 Import Integration

## Overview
This document describes the SF1 (School Form 1) import functionality integrated into the SAMS application.

## Features
- **Automatic extraction** of student data from SF1 Excel files
- **School ID validation** to ensure file is from AMPID 1 Elementary School (109481)
- **Bulk import** of students with duplicate detection
- **Detailed results** showing successful imports, duplicates, and failures
- **Grade-section validation** to ensure proper data integrity

## How to Use

### 1. Prepare SF1 File
- Ensure your SF1 Excel file (.xlsx or .xls) follows the standard format
- File should contain:
  - School ID in cell F3 (must be 109481)
  - Grade Level in cells AE4:AG4 (e.g., "Grade 4")
  - Section in cells AM4:AU4
  - Student data starting from row 7 with:
    - LRN in column A
    - Name in column C (format: "LAST,FIRST, MIDDLE")
    - Gender in column G (M/F)

### 2. Import Process
1. Navigate to **Add Student** page in SAMS
2. Click on the **Upload SF1** tab
3. Click the **Import** button
4. Select your SF1 Excel file
5. Wait for processing (a loading spinner will appear)
6. Review the import results

### 3. Import Results
The system will show:
- **Total students** in the file
- **Successfully imported** students
- **Duplicates** (students with existing LRN - these are skipped)
- **Failed** imports with error details

## Technical Details

### Files Modified/Created
1. **src/services/sf1-extractor.js** - SF1 file parsing logic
2. **src/database/student-service.js** - Added `bulkImportStudents` function
3. **src/main.js** - Added IPC handler for SF1 import
4. **src/preload.js** - Exposed `importSF1File` to renderer
5. **public/js/add-student.js** - Added file upload and processing UI

### Dependencies
- `exceljs` (^4.4.0) - Excel file parsing (already included for export functionality)

### Database Requirements
- The `grade_sections` table must have entries for the grade level and section in the SF1 file
- For example, if importing Grade 4 - MT MAKILING, ensure there's a record:
  ```sql
  grade_level = '4'
  section_name = 'MT MAKILING'
  ```

## Validation Rules
1. **School ID**: Must be 109481 (AMPID 1 Elementary School)
2. **File Format**: Must be .xlsx or .xls
3. **Grade-Section**: Must exist in the database
4. **LRN**: Must be unique (duplicates are skipped)
5. **Required Fields**: LRN, Name, Gender must be present

## Error Handling
- **Invalid School ID**: Alert shown, import cancelled
- **Missing Grade/Section**: Error message with details
- **Duplicate LRN**: Student skipped, listed in results
- **Invalid File Format**: Validation error before processing
- **Parse Errors**: Detailed error message shown to user

## Data Flow
1. User selects SF1 file → Frontend (add-student.js)
2. File converted to buffer → Sent via IPC
3. Backend extracts data → sf1-extractor.js
4. Validates school ID, grade, section
5. Bulk import to database → student-service.js
6. Results returned to frontend
7. Results modal displayed to user

## Installation
No additional dependencies needed! The SF1 import uses `exceljs`, which is already installed for the export functionality.

If you need to reinstall dependencies:
```bash
npm install
```

## Testing
Test the integration using the test file at:
`c:\Users\monde\Documents\Experimental\test-extract\makiling.xlsx`

Expected results:
- Grade: 4
- Section: MT MAKILING
- Total Students: 49 (24 males, 25 females)

## Notes
- RFID field is not included in SF1 files, so all imported students will have NULL RFID
- Students can be assigned RFID later through the student management interface
- Name parsing handles the format "LAST,FIRST, MIDDLE" automatically
- Gender is normalized to "Male" or "Female" regardless of input format (M/F)
