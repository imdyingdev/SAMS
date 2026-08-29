# Phase 4: Basic Promotion UI

## Objective
Create user interface components for individual student promotion and graduation operations.

## Tasks

### 1. Create Promotion Modal Component
**File**: `public/view-components/promotion-modal.html`

```html
<!-- Promotion Modal -->
<div class="modal-overlay" id="promotion-modal" style="display: none;">
  <div class="modal-content promotion-modal">
    <div class="modal-header">
      <h2 id="promotion-modal-title">Promote Student</h2>
      <button class="modal-close" id="promotion-modal-close">&times;</button>
    </div>
    
    <div class="modal-body">
      <div class="student-info-summary">
        <p><strong>Student:</strong> <span id="promotion-student-name">-</span></p>
        <p><strong>Current Grade/Section:</strong> <span id="promotion-current-grade">-</span></p>
      </div>
      
      <div class="promotion-form">
        <div class="form-group">
          <label for="promotion-target-grade">Target Grade Level</label>
          <select id="promotion-target-grade" class="form-control">
            <option value="">Select Grade</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="promotion-target-section">Target Section</label>
          <select id="promotion-target-section" class="form-control">
            <option value="">Select grade first</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="promotion-notes">Notes (optional)</label>
          <textarea id="promotion-notes" class="form-control" rows="3" placeholder="Add any notes about this promotion..."></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" id="promotion-cancel">Cancel</button>
        <button class="btn btn-primary" id="promotion-confirm">Promote Student</button>
      </div>
    </div>
  </div>
</div>

<!-- Graduation Modal -->
<div class="modal-overlay" id="graduation-modal" style="display: none;">
  <div class="modal-content graduation-modal">
    <div class="modal-header">
      <h2>Graduate Student</h2>
      <button class="modal-close" id="graduation-modal-close">&times;</button>
    </div>
    
    <div class="modal-body">
      <div class="student-info-summary">
        <p><strong>Student:</strong> <span id="graduation-student-name">-</span></p>
        <p><strong>Current Grade/Section:</strong> <span id="graduation-current-grade">-</span></p>
      </div>
      
      <div class="graduation-warning">
        <i class='bx bx-error-circle'></i>
        <p>This action will mark the student as graduated and archive their records. This cannot be undone.</p>
      </div>
      
      <div class="form-group">
        <label for="graduation-notes">Notes (optional)</label>
        <textarea id="graduation-notes" class="form-control" rows="3" placeholder="Add any notes about this graduation..."></textarea>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" id="graduation-cancel">Cancel</button>
        <button class="btn btn-danger" id="graduation-confirm">Graduate Student</button>
      </div>
    </div>
  </div>
</div>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-close:hover {
  color: #1f2937;
}

.modal-body {
  padding: 20px;
}

.student-info-summary {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.student-info-summary p {
  margin: 5px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.graduation-warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.graduation-warning i {
  color: #f59e0b;
  font-size: 1.25rem;
  margin-top: 2px;
}

.graduation-warning p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>
```

### 2. Create Promotion Modal JavaScript
**File**: `public/js/promotion-modal.js`

```javascript
// Promotion Modal Functionality
export function initializePromotionModal() {
  const promotionModal = document.getElementById('promotion-modal');
  const graduationModal = document.getElementById('graduation-modal');
  
  // Close buttons
  document.getElementById('promotion-modal-close').addEventListener('click', () => {
    promotionModal.style.display = 'none';
  });
  
  document.getElementById('graduation-modal-close').addEventListener('click', () => {
    graduationModal.style.display = 'none';
  });
  
  // Cancel buttons
  document.getElementById('promotion-cancel').addEventListener('click', () => {
    promotionModal.style.display = 'none';
  });
  
  document.getElementById('graduation-cancel').addEventListener('click', () => {
    graduationModal.style.display = 'none';
  });
  
  // Grade selection change handler
  document.getElementById('promotion-target-grade').addEventListener('change', async (e) => {
    const gradeLevel = e.target.value;
    const sectionSelect = document.getElementById('promotion-target-section');
    
    if (!gradeLevel) {
      sectionSelect.innerHTML = '<option value="">Select grade first</option>';
      sectionSelect.disabled = true;
      return;
    }
    
    try {
      sectionSelect.disabled = true;
      sectionSelect.innerHTML = '<option value="">Loading sections...</option>';
      
      const result = await window.electronAPI.getUniqueSections(gradeLevel);
      
      if (result.success && result.sections) {
        sectionSelect.innerHTML = '<option value="">Select section</option>';
        result.sections.forEach(section => {
          const option = document.createElement('option');
          option.value = section;
          option.textContent = section;
          sectionSelect.appendChild(option);
        });
        sectionSelect.disabled = false;
      } else {
        sectionSelect.innerHTML = '<option value="">No sections available</option>';
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      sectionSelect.innerHTML = '<option value="">Error loading sections</option>';
    }
  });
  
  // Confirm promotion
  document.getElementById('promotion-confirm').addEventListener('click', async () => {
    const studentId = document.getElementById('promotion-modal').dataset.studentId;
    const targetGrade = document.getElementById('promotion-target-grade').value;
    const targetSection = document.getElementById('promotion-target-section').value;
    const notes = document.getElementById('promotion-notes').value;
    
    if (!targetGrade || !targetSection) {
      alert('Please select target grade and section');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const result = await window.electronAPI.promoteStudent(
        studentId, 
        targetGrade, 
        targetSection, 
        user.id, 
        notes
      );
      
      if (result.success) {
        alert('Student promoted successfully!');
        promotionModal.style.display = 'none';
        // Refresh student list if needed
        if (typeof loadStudents === 'function') {
          loadStudents();
        }
      } else {
        alert('Promotion failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error promoting student:', error);
      alert('Error promoting student: ' + error.message);
    }
  });
  
  // Confirm graduation
  document.getElementById('graduation-confirm').addEventListener('click', async () => {
    const studentId = document.getElementById('graduation-modal').dataset.studentId;
    const notes = document.getElementById('graduation-notes').value;
    
    if (!confirm('Are you sure you want to graduate this student? This action cannot be undone.')) {
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const result = await window.electronAPI.graduateStudent(studentId, user.id, notes);
      
      if (result.success) {
        alert('Student graduated successfully!');
        graduationModal.style.display = 'none';
        // Refresh student list if needed
        if (typeof loadStudents === 'function') {
          loadStudents();
        }
      } else {
        alert('Graduation failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error graduating student:', error);
      alert('Error graduating student: ' + error.message);
    }
  });
}

// Show promotion modal
export function showPromotionModal(student) {
  const modal = document.getElementById('promotion-modal');
  document.getElementById('promotion-student-name').textContent = 
    `${student.first_name} ${student.last_name}`;
  document.getElementById('promotion-current-grade').textContent = 
    `Grade ${student.grade_level} - ${student.section}`;
  document.getElementById('promotion-modal').dataset.studentId = student.id;
  
  // Reset form
  document.getElementById('promotion-target-grade').value = '';
  document.getElementById('promotion-target-section').innerHTML = '<option value="">Select grade first</option>';
  document.getElementById('promotion-target-section').disabled = true;
  document.getElementById('promotion-notes').value = '';
  
  modal.style.display = 'flex';
}

// Show graduation modal
export function showGraduationModal(student) {
  const modal = document.getElementById('graduation-modal');
  document.getElementById('graduation-student-name').textContent = 
    `${student.first_name} ${student.last_name}`;
  document.getElementById('graduation-current-grade').textContent = 
    `Grade ${student.grade_level} - ${student.section}`;
  document.getElementById('graduation-modal').dataset.studentId = student.id;
  
  // Reset form
  document.getElementById('graduation-notes').value = '';
  
  modal.style.display = 'flex';
}
```

### 3. Add Promotion Buttons to Student Info View
**File**: `public/views/student-info.html`

Add promotion buttons to the action buttons section:

```html
<div class="action-buttons full-width">
  <button class="btn-cancel" id="btn-cancel">Cancel</button>
  <button class="btn-promote" id="btn-promote" style="display: none;">Promote Student</button>
  <button class="btn-graduate" id="btn-graduate" style="display: none;">Graduate Student</button>
  <button class="btn-save" id="btn-save">Save Changes</button>
</div>
```

Add styles for the new buttons:

```css
.btn-promote {
  background-color: #10B981;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 10px;
}

.btn-promote:hover {
  background-color: #059669;
}

.btn-graduate {
  background-color: #F59E0B;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 10px;
}

.btn-graduate:hover {
  background-color: #D97706;
}
```

### 4. Update Students JavaScript
**File**: `public/js/students.js`

Import and initialize the promotion modal:

```javascript
import { initializePromotionModal, showPromotionModal, showGraduationModal } from './promotion-modal.js';

// Add to initializeStudentsPage function
export function initializeStudentsPage() {
  // ... existing code ...
  
  // Initialize promotion modal
  initializePromotionModal();
  
  // ... rest of existing code ...
}
```

Update the student info view loading to show promotion buttons:

```javascript
// In the function that loads student info view
async function showStudentInfoView(studentId) {
  try {
    // ... existing code to load student data ...
    
    const student = await window.electronAPI.getStudentById(studentId);
    
    // Show promotion button for all students
    const promoteButton = document.getElementById('btn-promote');
    if (promoteButton) {
      promoteButton.style.display = 'inline-block';
      promoteButton.addEventListener('click', () => {
        showPromotionModal(student);
      });
    }
    
    // Show graduation button only for Grade 6 students
    const graduateButton = document.getElementById('btn-graduate');
    if (graduateButton) {
      if (student.grade_level === '6') {
        graduateButton.style.display = 'inline-block';
        graduateButton.addEventListener('click', () => {
          showGraduationModal(student);
        });
      } else {
        graduateButton.style.display = 'none';
      }
    }
    
    // ... rest of existing code ...
  } catch (error) {
    console.error('Error loading student info:', error);
  }
}
```

### 5. Add Modal to Main View
**File**: `public/views/index.html` or include in student info view

Add the modal HTML at the end of the body:

```html
<!-- Include promotion modal -->
<script type="module">
  import './promotion-modal.js';
</script>
```

## Testing Checklist
- [ ] Promotion modal opens correctly
- [ ] Graduation modal opens correctly
- [ ] Grade selection loads sections dynamically
- [ ] Individual promotion works end-to-end
- [ ] Individual graduation works end-to-end
- [ ] Promotion button shows for all students
- [ ] Graduation button shows only for Grade 6
- [ ] Form validation works
- [ ] Success/error messages display correctly
- [ ] Modal closes properly on cancel
- [ ] Student list refreshes after promotion/graduation
- [ ] Notes field works correctly

## Commit Message
```
feat: add individual student promotion and graduation UI components

- Add promotion modal with grade/section selection
- Add graduation modal with confirmation warning
- Implement dynamic section loading based on grade selection
- Add promotion button to student info view for all students
- Add graduation button to student info view for Grade 6 students only
- Add form validation and error handling
- Implement success/error feedback
- Add modal close functionality

This provides the UI for individual promotion and graduation operations.

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```

## Notes
- This phase focuses on individual operations only
- Batch operations will be added in Phase 5
- Modals are reusable components
- Dynamic section loading improves UX
- Grade 6 graduation has special warning
- Ready for batch UI development in next phase