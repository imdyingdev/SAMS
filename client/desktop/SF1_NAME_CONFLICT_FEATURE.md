# SF1 Import: Name Conflict Detection & LRN Update Feature

## Overview
Enhanced the SF1 import system to detect students with matching names but different LRNs, allowing for automatic LRN correction instead of treating them as new students.

## Problem Solved
**Before:** If a student existed in the system with a typo in their LRN, importing the correct SF1 data would:
- Show them as "Will Be Imported" (green)
- Create a duplicate student with correct LRN
- Leave the old record with incorrect LRN in database

**After:** System now:
- Detects name matches with different LRNs
- Shows as "LRN will be updated" (yellow/orange)
- Updates the existing student's LRN instead of creating duplicate

## Three Student States

### 1. 🔴 **Exact Duplicate (RED)** - Will Be Skipped
- **Condition:** Same LRN exists in database
- **Action:** Skip during import (already exists)
- **Display:** Red text and icon
- **Example:** Student with LRN 109481210210 already in system

### 2. 🟠 **Name Conflict (ORANGE/YELLOW)** - LRN Will Be Updated  
- **Condition:** Same name (first, last, middle) but different LRN
- **Action:** Update existing student's LRN with correct one from SF1
- **Display:** Orange icon + "(LRN will be updated)" label
- **Example:** 
  - DB: Grafe, John Raymond B. (LRN: 123456789 - typo)
  - SF1: Grafe, John Raymond B. (LRN: 109481210210 - correct)
  - Result: Update DB record to LRN 109481210210

### 3. 🟢 **New Student (GREEN)** - Will Be Imported
- **Condition:** Does not exist in database
- **Action:** Insert as new student record
- **Display:** Green icon, black text
- **Example:** Brand new student not in system

## Technical Implementation

### Backend Changes

#### 1. `student-service.js` - Enhanced Duplicate Check
```javascript
async function checkDuplicateLRNs(students) {
  // Returns:
  // - exactDuplicates: Same LRN
  // - nameConflicts: Same name, different LRN
}
```

**Detection Logic:**
- Fetch all existing students from database
- For each SF1 student:
  - Check if LRN matches → Exact duplicate
  - Check if name (first + last + middle) matches → Name conflict
  - Otherwise → New student

#### 2. `student-service.js` - Bulk Import with Updates
```javascript
async function bulkImportStudents(students, gradeLevel, section, nameConflicts) {
  // For each student:
  // - If in nameConflicts → UPDATE existing record's LRN
  // - Else → INSERT new record
}
```

**Update Query:**
```sql
UPDATE students
SET lrn = $1
WHERE id = $2
```

#### 3. `main.js` - IPC Handlers Updated
- `check-sf1-duplicates`: Returns `exactDuplicates` and `nameConflicts`
- `import-sf1-file`: Accepts `nameConflicts` parameter for updates

### Frontend Changes

#### 1. `add-student.js` - Enhanced Modal Display
**Three-color system:**
```javascript
if (isExactDuplicate) {
  color = '#ef4444';  // Red
  iconColor = '#ef4444';
} else if (isNameConflict) {
  color = '#1f2937';  // Black text
  iconColor = '#f59e0b';  // Orange icon
  suffix = '(LRN will be updated)';
} else {
  color = '#1f2937';  // Black text
  iconColor = '#10B981';  // Green icon
}
```

**Smart messaging:**
```javascript
if (exactDuplicateCount > 0 && nameConflictCount > 0) {
  "X students already exist and Y students will have their LRN updated."
} else if (exactDuplicateCount > 0) {
  "X students already exist. These will be skipped."
} else if (nameConflictCount > 0) {
  "X students have incorrect LRNs and will be updated."
}
```

#### 2. Summary Footer
Shows breakdown:
- **New:** X (green)
- **Update:** Y (orange)
- **Skip:** Z (red)

## Visual Display

```
┌──────────────────────────────┐
│ Confirm Import            × │
├──────────────────────────────┤
│ 2 students already exist and │
│ 3 students will have their   │
│ LRN updated. Continue?       │
│                              │
│ ● Skipped ● LRN Update ● New │
│ ┌────────────────────────┐   │
│ │● Abucay, Marc B.       │   │ GREEN (new)
│ │● Grafe, John Raymond B.│↕│ ORANGE (update LRN)
│ │  (LRN will be updated) │   │
│ │● Santos, Maria C.      │   │ RED (skip)
│ │● Torres, Pedro M.      │   │ GREEN (new)
│ └────────────────────────┘   │
│                              │
│ New: 2 | Update: 3 | Skip: 2 │
│                              │
│ [Cancel] [Continue Import]   │
└──────────────────────────────┘
```

## Name Matching Logic

**Case-insensitive comparison:**
```javascript
studentFirstName === existingFirstName &&
studentLastName === existingLastName &&
studentMiddleName === existingMiddleName
```

**Format:** All lowercase, trimmed
- "JOHN" → "john"
- "Raymond " → "raymond"
- "BRIX" → "brix"

## Import Behavior

### Without Conflicts
```
49 students → All new
Result: 49 inserted
```

### With Exact Duplicates
```
49 students → 44 exist, 5 new
Result: 5 inserted, 44 skipped
```

### With Name Conflicts
```
49 students → 3 name conflicts, 46 new
Result: 46 inserted, 3 updated
```

### Mixed Scenario
```
49 students → 2 exact duplicates, 3 name conflicts, 44 new
Result: 44 inserted, 3 updated, 2 skipped
```

## Database Changes

**Update operation:**
- Updates only the `lrn` field
- Preserves all other student data (name, RFID, section, etc.)
- Uses existing student ID from database

## Results Reporting

Import results now include:
```javascript
{
  success: [...],      // New students inserted
  updated: [...],      // Students with LRN updated
  failed: [...],       // Import failures
  duplicates: [...]    // Exact duplicates skipped
}
```

**Updated record includes:**
```javascript
{
  id: 123,
  name: "John Raymond Grafe",
  oldLrn: "123456789",
  newLrn: "109481210210"
}
```

## Benefits

1. **Data Accuracy** ✅
   - Corrects LRN typos automatically
   - Prevents duplicate student records
   - Maintains data integrity

2. **User Awareness** ✅
   - Clear visual indicators (3 colors)
   - Explicit "(LRN will be updated)" label
   - Summary counts before import

3. **Audit Trail** ✅
   - Console logs show old → new LRN
   - Import results include update details
   - Easy to verify changes

4. **Intelligent Matching** ✅
   - Name-based detection catches typos
   - Case-insensitive comparison
   - Considers first, last, AND middle names

## Testing Scenarios

### Test Case 1: Typo in LRN
- DB: Grafe, John Raymond B. (LRN: 123456)
- SF1: Grafe, John Raymond B. (LRN: 109481210210)
- ✅ Shows orange: "(LRN will be updated)"
- ✅ Updates to 109481210210

### Test Case 2: Same Student, Same LRN
- DB: Santos, Maria C. (LRN: 109481210001)
- SF1: Santos, Maria C. (LRN: 109481210001)
- ✅ Shows red: "Skipped"
- ✅ No action taken

### Test Case 3: Brand New Student
- DB: (not exists)
- SF1: Torres, Pedro M. (LRN: 109481210002)
- ✅ Shows green: "New"
- ✅ Inserts new record

## Error Handling

- If LRN update fails → Added to `failed` results
- If name comparison fails → Treated as new student
- If database query fails → Import stops with error message

## Future Enhancements

Potential improvements:
- Fuzzy name matching (e.g., "Jon" vs "John")
- Manual conflict resolution UI
- LRN change history tracking
- Bulk LRN correction tool
