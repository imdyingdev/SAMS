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

    // Set up Enter key navigation between inputs
    setupEnterKeyNavigation();

    // Set up gender dropdown behavior
    setupGenderDropdownBehavior();

    // Set up grade level keyboard shortcuts
    setupGradeLevelKeyboardShortcuts();

    // Set up dynamic section loading based on grade level
    setupDynamicSectionLoading();
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
    // Load retained values for all form fields
    const retainedFirstName = localStorage.getItem('addStudentFirstName');
    const retainedMiddleName = localStorage.getItem('addStudentMiddleName');
    const retainedLastName = localStorage.getItem('addStudentLastName');
    const retainedSuffix = localStorage.getItem('addStudentSuffix');
    const retainedLrn = localStorage.getItem('addStudentLrn');
    const retainedRfid = localStorage.getItem('addStudentRfid');
    const retainedGender = localStorage.getItem('addStudentGender');
    const retainedGradeLevel = localStorage.getItem('addStudentGradeLevel');
    const retainedSection = localStorage.getItem('addStudentSection');

    // Restore text inputs
    if (retainedFirstName) {
        const firstNameInput = document.getElementById('student-first-name');
        if (firstNameInput) firstNameInput.value = retainedFirstName;
    }

    if (retainedMiddleName) {
        const middleNameInput = document.getElementById('student-middle-name');
        if (middleNameInput) middleNameInput.value = retainedMiddleName;
    }

    if (retainedLastName) {
        const lastNameInput = document.getElementById('student-last-name');
        if (lastNameInput) lastNameInput.value = retainedLastName;
    }

    if (retainedSuffix) {
        const suffixInput = document.getElementById('student-suffix');
        if (suffixInput) suffixInput.value = retainedSuffix;
    }

    if (retainedLrn) {
        const lrnInput = document.getElementById('student-lrn');
        if (lrnInput) lrnInput.value = retainedLrn;
    }

    if (retainedRfid) {
        const rfidInput = document.getElementById('student-rfid');
        if (rfidInput) rfidInput.value = retainedRfid;
    }

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
        const sectionSelect = document.getElementById('student-section');
        if (sectionSelect) {
            sectionSelect.value = retainedSection;
            // Add event listener to update retained value when changed
            sectionSelect.addEventListener('change', (e) => {
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
    // Setup auto-save listeners for all text inputs
    const textInputs = [
        { id: 'student-first-name', key: 'addStudentFirstName' },
        { id: 'student-middle-name', key: 'addStudentMiddleName' },
        { id: 'student-last-name', key: 'addStudentLastName' },
        { id: 'student-suffix', key: 'addStudentSuffix' },
        { id: 'student-lrn', key: 'addStudentLrn' },
        { id: 'student-rfid', key: 'addStudentRfid' }
    ];

    textInputs.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        if (input && !input.hasAttribute('data-listener-added')) {
            input.setAttribute('data-listener-added', 'true');
            input.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                if (value) {
                    localStorage.setItem(key, value);
                } else {
                    localStorage.removeItem(key);
                }
            });
        }
    });

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
    const sectionSelect = document.getElementById('student-section');
    if (sectionSelect && !sectionSelect.hasAttribute('data-listener-added')) {
        sectionSelect.setAttribute('data-listener-added', 'true');
        sectionSelect.addEventListener('change', (e) => {
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
    const fields = [
        { id: 'student-first-name', key: 'addStudentFirstName' },
        { id: 'student-middle-name', key: 'addStudentMiddleName' },
        { id: 'student-last-name', key: 'addStudentLastName' },
        { id: 'student-suffix', key: 'addStudentSuffix' },
        { id: 'student-lrn', key: 'addStudentLrn' },
        { id: 'student-rfid', key: 'addStudentRfid' }
    ];

    fields.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        if (input && input.value.trim()) {
            localStorage.setItem(key, input.value.trim());
        }
    });

    const genderSelect = document.getElementById('student-gender');
    if (genderSelect && genderSelect.value) {
        localStorage.setItem('addStudentGender', genderSelect.value);
    }

    const gradeSelect = document.getElementById('student-grade-level');
    if (gradeSelect && gradeSelect.value) {
        localStorage.setItem('addStudentGradeLevel', gradeSelect.value);
    }

    const sectionSelect = document.getElementById('student-section');
    if (sectionSelect && sectionSelect.value.trim()) {
        localStorage.setItem('addStudentSection', sectionSelect.value.trim());
    }
}

function clearRetainedFormValues() {
    // Clear all retained form values from localStorage
    localStorage.removeItem('addStudentFirstName');
    localStorage.removeItem('addStudentMiddleName');
    localStorage.removeItem('addStudentLastName');
    localStorage.removeItem('addStudentSuffix');
    localStorage.removeItem('addStudentLrn');
    localStorage.removeItem('addStudentRfid');
    localStorage.removeItem('addStudentGender');
    localStorage.removeItem('addStudentGradeLevel');
    localStorage.removeItem('addStudentSection');
}

function clearFormInputs() {
    // Clear all form input fields
    const firstNameInput = document.getElementById('student-first-name');
    const middleNameInput = document.getElementById('student-middle-name');
    const lastNameInput = document.getElementById('student-last-name');
    const suffixInput = document.getElementById('student-suffix');
    const lrnInput = document.getElementById('student-lrn');
    const rfidInput = document.getElementById('student-rfid');
    const genderSelect = document.getElementById('student-gender');
    const gradeSelect = document.getElementById('student-grade-level');
    const sectionSelect = document.getElementById('student-section');

    if (firstNameInput) firstNameInput.value = '';
    if (middleNameInput) middleNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';
    if (suffixInput) suffixInput.value = '';
    if (rfidInput) rfidInput.value = '';
    
    // Reset LRN to default prefix
    const lrnPrefix = localStorage.getItem('lrnPrefix') || '109481';
    if (lrnInput) lrnInput.value = lrnPrefix;
    
    // Reset dropdowns
    if (genderSelect) {
        genderSelect.value = '';
        const genderPlaceholder = document.getElementById('gender-placeholder');
        if (genderPlaceholder) {
            genderPlaceholder.style.display = '';
            genderPlaceholder.disabled = false;
        }
    }
    if (gradeSelect) gradeSelect.value = '';
    if (sectionSelect) {
        sectionSelect.value = '';
        sectionSelect.disabled = true;
        sectionSelect.innerHTML = '<option value="">Select grade first</option>';
    }
}

function clearFormInputsExceptDropdowns() {
    // Clear only text input fields, keep gender, grade level, and section
    const firstNameInput = document.getElementById('student-first-name');
    const middleNameInput = document.getElementById('student-middle-name');
    const lastNameInput = document.getElementById('student-last-name');
    const suffixInput = document.getElementById('student-suffix');
    const lrnInput = document.getElementById('student-lrn');
    const rfidInput = document.getElementById('student-rfid');

    if (firstNameInput) firstNameInput.value = '';
    if (middleNameInput) middleNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';
    if (suffixInput) suffixInput.value = '';
    if (rfidInput) rfidInput.value = '';
    
    // Reset LRN to default prefix
    const lrnPrefix = localStorage.getItem('lrnPrefix') || '109481';
    if (lrnInput) lrnInput.value = lrnPrefix;
    
    // Clear localStorage for text inputs only
    localStorage.removeItem('addStudentFirstName');
    localStorage.removeItem('addStudentMiddleName');
    localStorage.removeItem('addStudentLastName');
    localStorage.removeItem('addStudentSuffix');
    localStorage.removeItem('addStudentLrn');
    localStorage.removeItem('addStudentRfid');
    
    // Keep gender, grade level, and section in localStorage for next student
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

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                
                // Validate file type
                const validExtensions = ['.xlsx', '.xls'];
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                
                if (!validExtensions.includes(fileExtension)) {
                    showValidationModal('Please select a valid Excel file (.xlsx or .xls)');
                    fileInput.value = ''; // Reset file input
                    return;
                }
                
                // Process the SF1 file
                await processSF1File(file);
                
                // Reset file input for next use
                fileInput.value = '';
            }
        });
    }
}

// Store file buffer and check result for later import after confirmation
let pendingImportBuffer = null;
let pendingCheckResult = null;

async function processSF1File(file) {
    try {
        // Show loading indicator
        showLoadingModal('Checking SF1 file...');
        
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        console.log('Checking file for duplicates...');
        
        // First, check for duplicates
        if (window.electronAPI && window.electronAPI.checkSF1Duplicates) {
            const checkResult = await window.electronAPI.checkSF1Duplicates(buffer);
            
            hideLoadingModal();
            
            console.log('SF1 check result:', checkResult);
            
            if (!checkResult || !checkResult.success) {
                console.error('SF1 check failed:', checkResult?.error);
                showValidationModal(checkResult?.error || 'Failed to check SF1 file');
                return;
            }
            
            // Validate required properties
            if (!checkResult.students || !Array.isArray(checkResult.students)) {
                console.error('Invalid check result - missing students array:', checkResult);
                showValidationModal('Invalid SF1 file format. Please check the file and try again.');
                return;
            }
            
            // Store buffer and check result for later import
            pendingImportBuffer = buffer;
            pendingCheckResult = checkResult;
            
            // Calculate total duplicates/conflicts
            const totalIssues = (checkResult.exactDuplicates?.length || 0) + (checkResult.nameConflicts?.length || 0);
            
            // If duplicates or conflicts exist, show confirmation modal
            if (checkResult.hasDuplicates || totalIssues > 0) {
                console.log(`Found ${checkResult.exactDuplicates?.length || 0} exact duplicates, ${checkResult.nameConflicts?.length || 0} name conflicts`);
                showSF1ConfirmationModal(checkResult);
            } else {
                // No duplicates, proceed with import
                console.log('No duplicates or conflicts found, proceeding with import');
                await performSF1Import(buffer);
            }
        } else {
            hideLoadingModal();
            console.error('Electron API not available');
            showValidationModal('Cannot import SF1 file: Application API not available');
        }
        
    } catch (error) {
        hideLoadingModal();
        console.error('Error processing SF1 file:', error);
        showValidationModal('Error processing SF1 file: ' + error.message);
    }
}

async function performSF1Import(buffer) {
    try {
        // Show loading indicator
        showLoadingModal('Importing students...');
        
        console.log('Sending file to backend for import...');
        
        // Get name conflicts from the stored check result
        const nameConflicts = pendingCheckResult?.nameConflicts || [];
        
        // Send to backend for processing
        if (window.electronAPI && window.electronAPI.importSF1File) {
            const result = await window.electronAPI.importSF1File(buffer, nameConflicts);
            
            hideLoadingModal();
            
            if (result.success) {
                console.log('SF1 import successful:', result.summary);
                showImportResultsModal(result.summary, result.results);
                pendingImportBuffer = null; // Clear pending buffer
                pendingCheckResult = null; // Clear check result
            } else {
                console.error('SF1 import failed:', result.error);
                showValidationModal(result.error || 'Failed to import SF1 file');
            }
        } else {
            hideLoadingModal();
            console.error('Electron API not available');
            showValidationModal('Cannot import SF1 file: Application API not available');
        }
        
    } catch (error) {
        hideLoadingModal();
        console.error('Error importing SF1 file:', error);
        showValidationModal('Error importing SF1 file: ' + error.message);
    }
}

function showSF1ConfirmationModal(checkResult) {
    const modal = document.getElementById('sf1-confirmation-modal');
    const messageElement = document.getElementById('sf1-confirmation-message');
    const duplicateListElement = document.getElementById('sf1-duplicate-list');
    const closeButton = document.getElementById('sf1-confirmation-close');
    const cancelButton = document.getElementById('btn-cancel-sf1-import');
    const confirmButton = document.getElementById('btn-confirm-sf1-import');
    
    if (!modal) {
        console.error('SF1 confirmation modal not found');
        return;
    }
    
    // Ensure all required properties exist
    if (!checkResult.students || !Array.isArray(checkResult.students)) {
        console.error('Invalid check result structure:', checkResult);
        showValidationModal('Invalid SF1 check result. Please try again.');
        return;
    }
    
    // Calculate counts
    const exactDuplicateCount = checkResult.exactDuplicates?.length || 0;
    const nameConflictCount = checkResult.nameConflicts?.length || 0;
    const totalCount = checkResult.totalStudents || 0;
    const newStudentsCount = totalCount - exactDuplicateCount - nameConflictCount;
    
    // Set message
    let message = '';
    if (exactDuplicateCount > 0 && nameConflictCount > 0) {
        message = `${exactDuplicateCount} student${exactDuplicateCount > 1 ? 's' : ''} already exist and ${nameConflictCount} student${nameConflictCount > 1 ? 's' : ''} will have their LRN update. Do you want to continue?`;
    } else if (exactDuplicateCount > 0) {
        message = `${exactDuplicateCount} out of ${totalCount} students already exist in the database. These will be skipped. Do you want to continue?`;
    } else if (nameConflictCount > 0) {
        message = `${nameConflictCount} out of ${totalCount} students have incorrect LRNs and will be update. Do you want to continue?`;
    } else {
        message = `All ${totalCount} students are new and will be imported. Do you want to continue?`;
    }
    messageElement.textContent = message;
    
    // Create lookup sets for quick checking
    const exactDuplicateLRNs = new Set((checkResult.exactDuplicates || []).map(d => d.lrn.toString()));
    
    // Create name conflict map (key: "firstname_lastname_middlename")
    const nameConflictMap = new Map();
    (checkResult.nameConflicts || []).forEach(conflict => {
        const key = `${conflict.first_name}_${conflict.last_name}_${conflict.middle_name}`.toLowerCase();
        nameConflictMap.set(key, conflict);
    });
    
    // Helper function to convert to Title Case
    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    // Helper function to format name with middle initial
    const formatName = (student) => {
        const lastName = toTitleCase(student.last_name || '');
        const firstName = toTitleCase(student.first_name || '');
        const middleName = toTitleCase(student.middle_name || '');
        
        let nameStr = lastName + ', ' + firstName;
        if (middleName) {
            // Get middle initial (first letter + period)
            const middleInitial = middleName.charAt(0) + '.';
            nameStr += ' ' + middleInitial;
        }
        return nameStr;
    };
    
    // Sort students alphabetically by last name
    const sortedStudents = [...checkResult.students].sort((a, b) => {
        const nameA = (a.last_name || '').toLowerCase();
        const nameB = (b.last_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    // Build student list with color coding
    let listHtml = '<div style="margin-bottom: 10px; padding: 8px; background: #f9fafb; border-radius: 4px; font-size: 0.85em;">';
    listHtml += '<span style="color: #ef4444; font-weight: 600;">● Skipped</span> ';
    listHtml += '<span style="color: #f59e0b; font-weight: 600;">● LRN Update</span> ';
    listHtml += '<span style="color: #10B981; font-weight: 600;">● New</span>';
    listHtml += '</div>';
    
    listHtml += '<div style="max-height: 150px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8px; background: white;">';
    
    // Show all students from the file (sorted)
    sortedStudents.forEach((student, index) => {
        const studentKey = `${student.first_name}_${student.last_name}_${student.middle_name}`.toLowerCase();
        const isExactDuplicate = exactDuplicateLRNs.has(student.lrn.toString());
        const conflict = nameConflictMap.get(studentKey);
        const isNameConflict = conflict !== undefined;
        
        let color, iconColor, suffix = '';
        
        if (isExactDuplicate) {
            // Exact duplicate - will be skipped (RED)
            color = '#ef4444';
            iconColor = '#ef4444';
        } else if (isNameConflict) {
            // Name conflict - LRN will be update (YELLOW/ORANGE)
            color = '#1f2937'; // Keep text black for readability
            iconColor = '#f59e0b'; // Orange/yellow icon
            suffix = ` <span style="color: #f59e0b; font-size: 0.85em;">(LRN will be update)</span>`;
        } else {
            // New student (GREEN)
            color = '#1f2937'; // Keep text black for readability
            iconColor = '#10B981';
        }
        
        const formattedName = formatName(student);
        
        listHtml += `<div style="padding: 5px 0; color: ${color}; font-size: 0.9em;">
            <span style="color: ${iconColor}; font-size: 0.8em;">●</span> 
            ${formattedName}${suffix}
        </div>`;
    });
    
    listHtml += '</div>';
    
    listHtml += `<div style="margin-top: 12px; padding: 8px; background: #f9fafb; border-radius: 4px; text-align: center; font-size: 0.85em;">
        <span style="color: #10B981; font-weight: 600;">New: ${newStudentsCount}</span>
        <span style="color: #d1d5db; margin: 0 6px;">|</span>
        <span style="color: #f59e0b; font-weight: 600;">Update: ${nameConflictCount}</span>
        <span style="color: #d1d5db; margin: 0 6px;">|</span>
        <span style="color: #ef4444; font-weight: 600;">Skip: ${exactDuplicateCount}</span>
    </div>`;
    
    duplicateListElement.innerHTML = listHtml;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Remove any existing event listeners by cloning and replacing
    const newCloseButton = closeButton.cloneNode(true);
    const newCancelButton = cancelButton.cloneNode(true);
    const newConfirmButton = confirmButton.cloneNode(true);
    
    closeButton.parentNode.replaceChild(newCloseButton, closeButton);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    
    // Add event listeners
    const hideModal = () => {
        modal.style.display = 'none';
        pendingImportBuffer = null; // Clear pending buffer if cancelled
        pendingCheckResult = null; // Clear check result
    };
    
    const proceedWithImport = async () => {
        modal.style.display = 'none';
        if (pendingImportBuffer) {
            await performSF1Import(pendingImportBuffer);
        }
    };
    
    newCloseButton.addEventListener('click', hideModal);
    newCancelButton.addEventListener('click', hideModal);
    newConfirmButton.addEventListener('click', proceedWithImport);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
}

function showLoadingModal(message) {
    // Create or show loading modal
    let loadingModal = document.getElementById('loading-modal');
    
    if (!loadingModal) {
        loadingModal = document.createElement('div');
        loadingModal.id = 'loading-modal';
        loadingModal.className = 'validation-modal-overlay';
        loadingModal.innerHTML = `
            <div class="validation-modal-content">
                <div class="validation-modal-body">
                    <div class="validation-icon">
                        <i class="fa-solid fa-spinner fa-spin" style="color: #3B82F6;"></i>
                    </div>
                    <p id="loading-message">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(loadingModal);
    } else {
        const messageElement = document.getElementById('loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
    
    loadingModal.style.display = 'flex';
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
}

function showImportResultsModal(summary, results) {
    // Create or show import results modal
    let resultsModal = document.getElementById('import-results-modal');
    
    if (!resultsModal) {
        resultsModal = document.createElement('div');
        resultsModal.id = 'import-results-modal';
        resultsModal.className = 'validation-modal-overlay';
        document.body.appendChild(resultsModal);
    }
    
    // Build summary message
    const updated = summary.updated || 0;
    const imported = summary.imported || 0;
    const skipped = summary.duplicates || 0;
    
    let summaryText = [];
    if (imported > 0) {
        summaryText.push(`${imported} new student${imported > 1 ? 's' : ''} imported`);
    }
    if (updated > 0) {
        summaryText.push(`${updated} LRN${updated > 1 ? 's' : ''} updated`);
    }
    if (skipped > 0) {
        summaryText.push(`${skipped} duplicate${skipped > 1 ? 's' : ''} skipped`);
    }
    
    const summaryMessage = summaryText.length > 0 
        ? summaryText.join(', ') + '.'
        : 'Import completed.';
    
    resultsModal.innerHTML = `
        <div class="validation-modal-content" style="max-width: 450px;">
            <button class="validation-modal-close" id="import-results-close">&times;</button>
            <div class="validation-modal-body">
                <div class="validation-icon">
                    <i class="fa-solid fa-circle-check" style="color: #10B981;"></i>
                </div>
                <h3 style="margin: 10px 0; color: #1f2937;">Import Successful</h3>
                <p style="margin: 15px 0; color: #6b7280; font-size: 1em; line-height: 1.5;">
                    ${summaryMessage}
                </p>
                <button class="btn-ok" id="import-results-ok" style="margin-top: 15px; padding: 10px 30px; background: #10B981; color: white; border: none;">OK</button>
            </div>
        </div>
    `;
    
    resultsModal.style.display = 'flex';
    
    // Add event listeners
    const closeButton = document.getElementById('import-results-close');
    const okButton = document.getElementById('import-results-ok');
    
    const closeModal = () => {
        resultsModal.style.display = 'none';
        // Navigate to students view to see imported students
        if (window.navigateToView) {
            window.navigateToView('students');
        }
    };
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (okButton) {
        okButton.addEventListener('click', closeModal);
    }
    
    // Close when clicking outside
    resultsModal.addEventListener('click', (e) => {
        if (e.target === resultsModal) {
            closeModal();
        }
    });
}

function setupAddStudentButtons() {
    const cancelButton = document.getElementById('btn-cancel');
    const createButton = document.getElementById('btn-create');
    const successCloseButton = document.getElementById('success-modal-close');
    const errorOkButton = document.getElementById('btn-error-ok');
    const validationCloseButton = document.getElementById('validation-modal-close');

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
                let missingFields = [];
                if (!studentData.first_name) missingFields.push('First Name');
                if (!studentData.last_name) missingFields.push('Last Name');
                if (!studentData.gender) missingFields.push('Gender');
                if (!studentData.grade_level) missingFields.push('Grade Level');
                if (!studentData.section) missingFields.push('Section');
                if (!studentData.lrn) missingFields.push('LRN');
                
                if (missingFields.length > 0) {
                    showValidationModal(`Please fill in all required fields: ${missingFields.join(', ')}.`);
                    return;
                }

                if (window.electronAPI) {
                    const result = await window.electronAPI.createStudent(studentData);

                    if (result && result.success) {
                        console.log('Student created successfully:', result.student);
                        // Clear form but keep gender, grade level, and section for next student
                        clearFormInputsExceptDropdowns();
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
                        showValidationModal(errorMessage);
                    }
                } else {
                    console.error('Electron API not available');
                    showValidationModal('Cannot create student: Application API not available');
                }
            } catch (error) {
                console.error('Error creating student:', error);
                showValidationModal('Error creating student: ' + error.message);
            }
        });
    }

    // Success modal close button
    if (successCloseButton) {
        successCloseButton.addEventListener('click', () => {
            hideSuccessModal();
            // Navigate back to students view
            if (window.navigateToView) {
                window.navigateToView('students');
            }
        });
    }

    // Close success modal when clicking outside
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                hideSuccessModal();
                // Navigate back to students view
                if (window.navigateToView) {
                    window.navigateToView('students');
                }
            }
        });
    }

    // Error modal OK button
    if (errorOkButton) {
        errorOkButton.addEventListener('click', () => {
            hideErrorModal();
        });
    }

    // Validation modal close button
    if (validationCloseButton) {
        validationCloseButton.addEventListener('click', () => {
            hideValidationModal();
        });
    }

    // Close validation modal when clicking outside
    const validationModal = document.getElementById('validation-modal');
    if (validationModal) {
        validationModal.addEventListener('click', (e) => {
            if (e.target === validationModal) {
                hideValidationModal();
            }
        });
    }
}

function setupRfidInput() {
    const rfidInput = document.getElementById('student-rfid');
    if (!rfidInput) return;

    let isScanning = false;
    let scanBuffer = '';
    let backspaceTooltipTimeout = null;
    let isTooltipShownForBackspace = false;

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
            // Only capture alphanumeric characters and ignore control keys
            const key = event.key;
            
            // Check if it's a valid character for RFID (alphanumeric)
            if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
                // Start or continue scanning
                if (!isScanning) {
                    isScanning = true;
                    scanBuffer = '';
                }
                scanBuffer += key;
                // Reset backspace tooltip flag when user starts typing
                isTooltipShownForBackspace = false;
            } else if (key === 'Backspace' || key === 'Delete') {
                // Allow normal backspace/delete behavior for manual editing
                // Don't add these to scan buffer
                isScanning = false;
                scanBuffer = '';
                
                // Show tooltip on backspace (with debounce)
                if (!isTooltipShownForBackspace) {
                    showRfidTooltipOnBackspace();
                    isTooltipShownForBackspace = true;
                    
                    // Reset the flag after a delay to allow showing again later
                    clearTimeout(backspaceTooltipTimeout);
                    backspaceTooltipTimeout = setTimeout(() => {
                        isTooltipShownForBackspace = false;
                    }, 3000); // Reset after 3 seconds
                }
            }
        }
    });

    // Reset tooltip flag when field loses focus
    rfidInput.addEventListener('blur', () => {
        isTooltipShownForBackspace = false;
        clearTimeout(backspaceTooltipTimeout);
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

function showRfidTooltipOnBackspace() {
    const tooltip = document.getElementById('rfid-tooltip');
    
    if (tooltip) {
        // Show the tooltip
        tooltip.style.display = 'block';
        console.log('Showing RFID tooltip due to backspace');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            tooltip.style.display = 'none';
            console.log('Auto-hiding RFID tooltip after backspace');
        }, 3000);
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

function showValidationModal(message) {
    const modal = document.getElementById('validation-modal');
    const messageElement = document.getElementById('validation-message');
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'flex';
    }
}

function hideValidationModal() {
    const modal = document.getElementById('validation-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupEnterKeyNavigation() {
    // Define the input navigation order (excluding RFID to prevent conflicts with RFID reader)
    const inputOrder = [
        'student-first-name',
        'student-middle-name',
        'student-last-name',
        'student-suffix',
        'student-gender',
        'student-grade-level',
        'student-section',
        'student-lrn'
        // Note: RFID input is excluded to prevent auto-submission when RFID reader sends Enter
    ];

    // Add Enter key event listeners to each input
    inputOrder.forEach((inputId, index) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    
                    // Find the next input in the sequence
                    const nextIndex = index + 1;
                    if (nextIndex < inputOrder.length) {
                        const nextInputId = inputOrder[nextIndex];
                        const nextInput = document.getElementById(nextInputId);
                        if (nextInput) {
                            nextInput.focus();
                        }
                    } else {
                        // If we're at the last input (LRN), move to RFID but don't auto-submit
                        const rfidInput = document.getElementById('student-rfid');
                        if (rfidInput) {
                            rfidInput.focus();
                        }
                    }
                }
            });
        }
    });
}

function setupGenderDropdownBehavior() {
    const genderSelect = document.getElementById('student-gender');
    const genderPlaceholder = document.getElementById('gender-placeholder');
    
    if (genderSelect && genderPlaceholder) {
        genderSelect.addEventListener('change', function() {
            // If a valid gender is selected (not empty), hide the placeholder option
            if (this.value !== '') {
                genderPlaceholder.style.display = 'none';
                genderPlaceholder.disabled = true;
            }
        });

        // Also check on page load if there's a retained value
        if (genderSelect.value !== '') {
            genderPlaceholder.style.display = 'none';
            genderPlaceholder.disabled = true;
        }
    }
}

function setupGradeLevelKeyboardShortcuts() {
    const gradeLevelSelect = document.getElementById('student-grade-level');
    
    if (gradeLevelSelect) {
        gradeLevelSelect.addEventListener('keydown', function(event) {
            // Check if a number key (1-6) was pressed
            const keyPressed = event.key;
            
            if (keyPressed >= '1' && keyPressed <= '6') {
                event.preventDefault();
                
                // Set the value to the corresponding grade
                const gradeValue = `Grade ${keyPressed}`;
                this.value = gradeValue;
                
                // Trigger change event to ensure any existing listeners are called
                const changeEvent = new Event('change', { bubbles: true });
                this.dispatchEvent(changeEvent);
                
                // Close the dropdown by blurring the select element
                this.blur();
            }
        });

        // Also handle when the dropdown is focused and user types numbers
        gradeLevelSelect.addEventListener('focus', function() {
            // Add a temporary keydown listener for when dropdown is open
            const handleKeyPress = (event) => {
                const keyPressed = event.key;
                
                if (keyPressed >= '1' && keyPressed <= '6') {
                    event.preventDefault();
                    
                    // Set the value to the corresponding grade
                    const gradeValue = `Grade ${keyPressed}`;
                    this.value = gradeValue;
                    
                    // Trigger change event
                    const changeEvent = new Event('change', { bubbles: true });
                    this.dispatchEvent(changeEvent);
                    
                    // Close the dropdown
                    this.blur();
                    
                    // Remove this temporary listener
                    document.removeEventListener('keydown', handleKeyPress);
                }
            };
            
            // Add temporary listener to document to catch keypresses
            document.addEventListener('keydown', handleKeyPress);
            
            // Remove the listener when dropdown loses focus
            this.addEventListener('blur', () => {
                document.removeEventListener('keydown', handleKeyPress);
            }, { once: true });
        });
    }
}

function setupDynamicSectionLoading() {
    const gradeSelect = document.getElementById('student-grade-level');
    const sectionSelect = document.getElementById('student-section');

    if (!gradeSelect || !sectionSelect) return;

    // Load sections when grade level changes
    gradeSelect.addEventListener('change', async (e) => {
        const gradeLevel = e.target.value;
        
        if (!gradeLevel) {
            // No grade selected, disable section dropdown
            sectionSelect.disabled = true;
            sectionSelect.innerHTML = '<option value="">Select grade first</option>';
            return;
        }

        try {
            // Extract grade number from "Grade X" format
            const gradeNumber = gradeLevel.replace('Grade ', '').trim();
            
            // Fetch sections for this grade level
            if (window.electronAPI) {
                const result = await window.electronAPI.getUniqueSections(gradeNumber);
                
                if (result.success && result.sections) {
                    const sections = result.sections;
                    
                    // Enable section dropdown and populate options
                    sectionSelect.disabled = false;
                    sectionSelect.innerHTML = '<option value="">Select section</option>';
                    
                    sections.forEach(section => {
                        const option = document.createElement('option');
                        option.value = section;
                        option.textContent = section;
                        sectionSelect.appendChild(option);
                    });
                    
                    // Try to restore retained section value if it exists in the new list
                    const retainedSection = localStorage.getItem('addStudentSection');
                    if (retainedSection && sections.includes(retainedSection)) {
                        sectionSelect.value = retainedSection;
                    }
                } else {
                    console.error('Failed to load sections:', result.message);
                    sectionSelect.disabled = true;
                    sectionSelect.innerHTML = '<option value="">No sections found</option>';
                }
            } else {
                console.error('Electron API not available');
                sectionSelect.disabled = true;
                sectionSelect.innerHTML = '<option value="">API not available</option>';
            }
        } catch (error) {
            console.error('Error loading sections:', error);
            sectionSelect.disabled = true;
            sectionSelect.innerHTML = '<option value="">Error loading sections</option>';
        }
    });

    // If there's a retained grade level on page load, trigger section loading
    if (gradeSelect.value) {
        const changeEvent = new Event('change', { bubbles: true });
        gradeSelect.dispatchEvent(changeEvent);
    }
}
