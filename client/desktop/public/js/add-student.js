// Add Student page functionality as ES6 module
import { initializeLogout } from './logout.js';

export function initializeAddStudentPage() {
    console.log('Add Student page script initialized');

    // Initialize logout functionality
    initializeLogout();

    // Check if Electron API is available
    if (window.electronAPI) {
        console.log('✅ Electron API available');
    } else {
        console.warn('⚠️ Electron API not available');
    }

    // Load LRN prefix from settings
    loadLrnPrefix();

    // Set up tab switching
    setupTabSwitching();

    // Set up import button
    setupImportButton();

    // Set up button event listeners
    setupAddStudentButtons();

    // Set up RFID input handling for keyboard wedge reader
    setupRfidInput();

    // Set up RFID help tooltip
    setupRfidTooltip();
}

function loadLrnPrefix() {
    const lrnPrefix = localStorage.getItem('lrnPrefix') || '109481';
    const lrnInput = document.getElementById('student-lrn');
    if (lrnInput) {
        lrnInput.value = lrnPrefix;
    }

    // Load retained form values from localStorage
    loadRetainedFormValues();
}

function loadRetainedFormValues() {
    // Load retained values for gender, grade level, and section
    const retainedGender = localStorage.getItem('addStudentGender');
    const retainedGradeLevel = localStorage.getItem('addStudentGradeLevel');
    const retainedSection = localStorage.getItem('addStudentSection');

    if (retainedGender) {
        const genderSelect = document.getElementById('student-gender');
        if (genderSelect) {
            genderSelect.value = retainedGender;
            // Add event listener to update retained value when changed
            genderSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    localStorage.setItem('addStudentGender', e.target.value);
                } else {
                    localStorage.removeItem('addStudentGender');
                }
            });
        }
    }

    if (retainedGradeLevel) {
        const gradeSelect = document.getElementById('student-grade-level');
        if (gradeSelect) {
            gradeSelect.value = retainedGradeLevel;
            // Add event listener to update retained value when changed
            gradeSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    localStorage.setItem('addStudentGradeLevel', e.target.value);
                } else {
                    localStorage.removeItem('addStudentGradeLevel');
                }
            });
        }
    }

    if (retainedSection) {
        const sectionInput = document.getElementById('student-section');
        if (sectionInput) {
            sectionInput.value = retainedSection;
            // Add event listener to update retained value when changed
            sectionInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                if (value) {
                    localStorage.setItem('addStudentSection', value);
                } else {
                    localStorage.removeItem('addStudentSection');
                }
            });
        }
    }

    // Also add listeners for fields that might not have retained values initially
    setupFieldListeners();
}

function setupFieldListeners() {
    // Setup listeners for gender field if not already done
    const genderSelect = document.getElementById('student-gender');
    if (genderSelect && !genderSelect.hasAttribute('data-listener-added')) {
        genderSelect.setAttribute('data-listener-added', 'true');
        genderSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                localStorage.setItem('addStudentGender', e.target.value);
            } else {
                localStorage.removeItem('addStudentGender');
            }
        });
    }

    // Setup listeners for grade level field if not already done
    const gradeSelect = document.getElementById('student-grade-level');
    if (gradeSelect && !gradeSelect.hasAttribute('data-listener-added')) {
        gradeSelect.setAttribute('data-listener-added', 'true');
        gradeSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                localStorage.setItem('addStudentGradeLevel', e.target.value);
            } else {
                localStorage.removeItem('addStudentGradeLevel');
            }
        });
    }

    // Setup listeners for section field if not already done
    const sectionInput = document.getElementById('student-section');
    if (sectionInput && !sectionInput.hasAttribute('data-listener-added')) {
        sectionInput.setAttribute('data-listener-added', 'true');
        sectionInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value) {
                localStorage.setItem('addStudentSection', value);
            } else {
                localStorage.removeItem('addStudentSection');
            }
        });
    }
}

function retainFormValues() {
    // Save current form values to localStorage
    const genderSelect = document.getElementById('student-gender');
    const gradeSelect = document.getElementById('student-grade-level');
    const sectionInput = document.getElementById('student-section');

    if (genderSelect && genderSelect.value) {
        localStorage.setItem('addStudentGender', genderSelect.value);
    }

    if (gradeSelect && gradeSelect.value) {
        localStorage.setItem('addStudentGradeLevel', gradeSelect.value);
    }

    if (sectionInput && sectionInput.value.trim()) {
        localStorage.setItem('addStudentSection', sectionInput.value.trim());
    }
}

function clearRetainedFormValues() {
    // Clear retained values from localStorage
    localStorage.removeItem('addStudentGender');
    localStorage.removeItem('addStudentGradeLevel');
    localStorage.removeItem('addStudentSection');
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show the corresponding tab content
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function setupImportButton() {
    const importButton = document.getElementById('btn-import-sf1');
    const fileInput = document.getElementById('sf1-file-input');

    if (importButton && fileInput) {
        importButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                // Future: Add file processing logic here
                alert('File selected: ' + file.name + '\n\nImport functionality will be implemented soon.');
            }
        });
    }
}

function setupAddStudentButtons() {
    const cancelButton = document.getElementById('btn-cancel');
    const createButton = document.getElementById('btn-create');
    const successOkButton = document.getElementById('btn-success-ok');
    const errorOkButton = document.getElementById('btn-error-ok');

    // Cancel button
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Clear retained form values when user cancels
            clearRetainedFormValues();
            
            // Navigate back to students view
            if (window.navigateToView) {
                window.navigateToView('students');
            }
        });
    }

    // Create button functionality
    if (createButton) {
        createButton.addEventListener('click', async () => {
            try {
                // Retain form values before creating student
                retainFormValues();

                const studentData = {
                    lrn: document.getElementById('student-lrn').value.trim(),
                    grade_level: document.getElementById('student-grade-level').value,
                    section: document.getElementById('student-section').value.trim(),
                    first_name: document.getElementById('student-first-name').value.trim(),
                    middle_name: document.getElementById('student-middle-name').value.trim(),
                    last_name: document.getElementById('student-last-name').value.trim(),
                    suffix: document.getElementById('student-suffix').value.trim(),
                    gender: document.getElementById('student-gender').value,
                    rfid: document.getElementById('student-rfid').value.trim()
                };

                // Basic validation
                if (!studentData.first_name || !studentData.last_name || !studentData.grade_level) {
                    let missingFields = [];
                    if (!studentData.first_name) missingFields.push('First Name');
                    if (!studentData.last_name) missingFields.push('Last Name');
                    if (!studentData.grade_level) missingFields.push('Grade Level');
                    showErrorModal(`Please fill in all required fields: ${missingFields.join(', ')}.`);
                    return;
                }

                if (window.electronAPI) {
                    const result = await window.electronAPI.createStudent(studentData);

                    if (result && result.success) {
                        console.log('Student created successfully:', result.student);
                        // Show success modal instead of alert
                        showSuccessModal();
                    } else {
                        console.error('Failed to create student:', result?.message);
                        // Handle specific error messages professionally
                        let errorMessage = 'Failed to create student: Unknown error';
                        if (result?.message) {
                            if (result.message.includes('RFID') && result.message.includes('already')) {
                                errorMessage = 'This RFID card is already assigned to another student. Please use a different RFID card.';
                            } else if (result.message.includes('LRN') && result.message.includes('already')) {
                                errorMessage = 'A student with this LRN already exists. Please use a different LRN.';
                            } else {
                                errorMessage = `Failed to create student: ${result.message}`;
                            }
                        }
                        showErrorModal(errorMessage);
                    }
                } else {
                    console.error('Electron API not available');
                    showErrorModal('Cannot create student: Application API not available');
                }
            } catch (error) {
                console.error('Error creating student:', error);
                showErrorModal('Error creating student: ' + error.message);
            }
        });
    }

    // Success modal OK button
    if (successOkButton) {
        successOkButton.addEventListener('click', () => {
            hideSuccessModal();
            // Navigate back to students view
            if (window.navigateToView) {
                window.navigateToView('students');
            }
        });
    }

    // Error modal OK button
    if (errorOkButton) {
        errorOkButton.addEventListener('click', () => {
            hideErrorModal();
        });
    }
}

function setupRfidInput() {
    const rfidInput = document.getElementById('student-rfid');
    if (!rfidInput) return;

    let isScanning = false;
    let scanBuffer = '';

    // Handle keyboard wedge RFID reader input
    rfidInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (isScanning && scanBuffer) {
                // Complete scan - replace the RFID value
                rfidInput.value = scanBuffer;
                isScanning = false;
                scanBuffer = '';
            }
        } else {
            // Start or continue scanning
            if (!isScanning) {
                isScanning = true;
                scanBuffer = '';
            }
            scanBuffer += event.key;
        }
    });
}

function setupRfidTooltip() {
    const helpIcon = document.getElementById('rfid-help-icon');
    const tooltip = document.getElementById('rfid-tooltip');

    console.log('Setting up RFID tooltip...', { helpIcon, tooltip });

    if (helpIcon && tooltip) {
        console.log('Both elements found, adding click listener');

        // Simple display-based toggle
        helpIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Help icon clicked, toggling tooltip');

            // Simple display toggle
            const isVisible = tooltip.style.display !== 'none';

            if (isVisible) {
                tooltip.style.display = 'none';
                console.log('Hiding tooltip');
            } else {
                tooltip.style.display = 'block';
                console.log('Showing tooltip');
            }

            // Hide tooltip when clicking elsewhere
            const hideTooltip = function(event) {
                if (!helpIcon.contains(event.target) && !tooltip.contains(event.target)) {
                    tooltip.style.display = 'none';
                    document.removeEventListener('click', hideTooltip);
                    console.log('Hiding tooltip from outside click');
                }
            };

            if (!isVisible) {
                setTimeout(() => {
                    document.addEventListener('click', hideTooltip);
                }, 10);
            }
        });
    } else {
        console.error('RFID tooltip elements not found:', { helpIcon, tooltip });
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showErrorModal(message) {
    const modal = document.getElementById('error-modal');
    const messageElement = document.getElementById('error-message');
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'flex';
    }
}

function hideErrorModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
