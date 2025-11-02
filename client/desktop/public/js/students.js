// Students page functionality as ES6 module
import { initializeLogout } from './logout.js';

export function initializeStudentsPage() {
    console.log('Students page script initialized');

    // Initialize logout functionality
    initializeLogout();

    // Ensure table elements are in correct initial state
    initializeTableVisibility();

    // Check if Electron API is available
    if (window.electronAPI) {
        console.log('✅ Electron API available');
    } else {
        console.warn('⚠️ Electron API not available');
    }

    // Add window focus/blur event listeners to monitor input states
    window.addEventListener('focus', () => {
        if (isStudentInfoViewActive) {
            const inputs = document.querySelectorAll('.field-input');
            inputs.forEach((input) => {
                // Force re-enable regardless of current state
                input.removeAttribute('disabled');
                input.removeAttribute('readonly');
                input.disabled = false;
                input.readOnly = false;
                input.style.pointerEvents = 'auto';
                input.style.opacity = '1';
                input.tabIndex = 0;
            });
        }
    });
}

// Initialize table visibility state
function initializeTableVisibility() {
    const studentsTable = document.getElementById('students-table');
    const statusIndicator = document.getElementById('table-status-indicator');
    const paginationContainer = document.getElementById('pagination-container');
    const tableOptions = document.querySelector('.table-options');
    
    // Show loading state initially
    showTableStatus('loading', 'Loading students...', 'Please wait while we fetch the student data.');
    
    if (studentsTable) {
        studentsTable.style.display = 'none';
        studentsTable.style.opacity = '0';
    }
    
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }
    
    if (tableOptions) {
        tableOptions.style.display = 'flex';
    }
}


// Pagination state
let currentPage = 1;
let currentPageSize = 50;
let currentSearchTerm = '';
let currentGradeFilter = '';
let currentRfidFilter = '';
let totalPages = 1;
let totalStudents = 0;

// Student info view state
let isStudentInfoViewActive = false;

export async function loadStudents(page = 1, resetFilters = false) {
    console.log(`Requesting student list page ${page}...`);
    const studentListBody = document.getElementById('student-list-body');
    const statusIndicator = document.getElementById('table-status-indicator');
    const studentsTable = document.getElementById('students-table');
    const paginationContainer = document.getElementById('pagination-container');
    const tableOptions = document.querySelector('.table-options');

    // Reset filters if requested
    if (resetFilters) {
        currentSearchTerm = '';
        currentGradeFilter = '';
        currentRfidFilter = '';
        const searchInput = document.getElementById('student-search');
        if (searchInput) searchInput.value = '';
    }

    // Update current page
    currentPage = page;

    // Show loading state
    showTableStatus('loading', 'Loading students...', 'Please wait while we fetch the student data.');
    
    // Hide table initially but keep table-options visible
    if (studentsTable) {
        studentsTable.style.opacity = '0';
        studentsTable.style.display = 'none';
    }
    // Don't hide table-options during page changes to prevent blinking

    try {
        const result = await window.electronAPI.getStudentsPaginated(
            currentPage, 
            currentPageSize, 
            currentSearchTerm, 
            currentGradeFilter, 
            currentRfidFilter
        );
        console.log('Received paginated student data:', result);

        if (!result || !result.students || !Array.isArray(result.students)) {
            throw new Error('Invalid data received from main process.');
        }

        const { students, pagination } = result;
        
        // Update pagination state
        totalPages = pagination.totalPages;
        totalStudents = pagination.totalStudents;
        currentPage = pagination.currentPage;

        if (students.length === 0) {
            // Show no results status
            const title = totalStudents === 1 ? 'No Students Found.' : 'No Results Found.';
            const message = totalStudents === 1 
                ? 'No students have been added to the database yet.' 
                : 'No students match your current search criteria. Try adjusting your filters.';
            
            showTableStatus('no-results', title, message);
            
            // Keep table hidden when no results
            if (studentsTable) {
                studentsTable.style.display = 'none';
            }
            
            // Keep table options visible - only hide pagination if no results at all
            if (totalStudents === 0 && paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            
            // Update pagination controls even with no results on current page
            if (totalStudents > 0) {
                updatePaginationControls(pagination);
                if (paginationContainer) paginationContainer.style.display = 'flex';
            }
            return;
        }

        // Hide status indicator when we have results
        hideTableStatus();
        
        // Show and fade in table when there are results
        if (studentsTable) {
            studentsTable.style.display = 'table';
            studentsTable.style.opacity = '0';
            setTimeout(() => {
                if (studentsTable) studentsTable.style.opacity = '1';
            }, 10);
        }
        
        // Render students
        renderStudents(students);
        
        // Update pagination controls (table options already visible)
        updatePaginationControls(pagination);
        if (paginationContainer) paginationContainer.style.display = 'flex';
        
    } catch (error) {
        console.error('Failed to load students:', error);
        
        // Show error status
        showTableStatus('error', 'Error Loading Students', `Failed to load student data: ${error.message}`);
        
        // Hide table
        if (studentsTable) {
            studentsTable.style.display = 'none';
        }
        
        // Keep table options visible and update pagination if we had pages before the error
        if (totalPages > 1) {
            if (paginationContainer) paginationContainer.style.display = 'flex';
            // Update pagination with current state to maintain navigation
            updatePaginationControls({
                currentPage: currentPage,
                totalPages: totalPages,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage < totalPages,
                totalStudents: totalStudents
            });
        } else {
            if (paginationContainer) paginationContainer.style.display = 'none';
        }
    }
}

// Table status indicator functions
function showTableStatus(type, title, message) {
    const statusIndicator = document.getElementById('table-status-indicator');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const statusSpinner = document.getElementById('status-spinner');
    const statusSearchIcon = document.getElementById('status-search-icon');
    const statusErrorIcon = document.getElementById('status-error-icon');
    
    if (!statusIndicator) return;
    
    // Show the status indicator
    statusIndicator.style.display = 'flex';
    
    // Update text content
    if (statusTitle) statusTitle.textContent = title;
    if (statusMessage) statusMessage.textContent = message;
    
    // Show appropriate icon based on type
    if (statusSpinner) statusSpinner.style.display = type === 'loading' ? 'block' : 'none';
    if (statusSearchIcon) statusSearchIcon.style.display = type === 'no-results' ? 'block' : 'none';
    if (statusErrorIcon) statusErrorIcon.style.display = type === 'error' ? 'block' : 'none';
}

function hideTableStatus() {
    const statusIndicator = document.getElementById('table-status-indicator');
    if (statusIndicator) {
        statusIndicator.style.display = 'none';
    }
}

// Helper function for smooth fade transitions (legacy - kept for compatibility)
async function fadeTransition(fromElement, toElement) {
    // Fade out the loading container
    if (fromElement) {
        fromElement.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 200));
        fromElement.style.display = 'none';
    }
    
    // Fade in the table
    if (toElement) {
        toElement.style.display = 'table';
        toElement.style.opacity = '0';
        setTimeout(() => {
            if (toElement) toElement.style.opacity = '1';
        }, 10);
    }
}

// Search and filtering handled server-side in student-service.js

function renderStudents(students) {
    const studentListBody = document.getElementById('student-list-body');
    
    studentListBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        const fullName = `${student.first_name || ''} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name || ''} ${student.suffix || ''}`.trim();
        const rfidStatus = student.rfid 
            ? `<span class="status status-assigned">${student.rfid}</span>` 
            : `<span class="status status-unassigned">Not Assigned</span>`;

        row.innerHTML = `
            <td>${student.lrn || 'N/A'}</td>
            <td>${fullName}</td>
            <td>${student.grade_level || 'N/A'}</td>
<<<<<<< HEAD
            <td>${student.section || 'N/A'}</td>
=======
>>>>>>> origin/main
            <td>${rfidStatus}</td>
            <td class="action-icons">
                <i class="fa-solid fa-pen-to-square action-icon edit-icon" title="Edit"></i>
                <i class="fa-solid fa-trash action-icon delete-icon" title="Delete"></i>
            </td>
        `;
        
        // Add click events for action icons
        const editIcon = row.querySelector('.edit-icon');
        const deleteIcon = row.querySelector('.delete-icon');
        
        if (editIcon) {
            editIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showStudentInfo(student);
            });
        }
        
        if (deleteIcon) {
            deleteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteStudent(student);
            });
        }
        
        studentListBody.appendChild(row);
    });
}

// Handle delete student
async function handleDeleteStudent(student) {
    const fullName = `${student.first_name || ''} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name || ''} ${student.suffix || ''}`.trim();
    
    if (confirm(`Are you sure you want to delete ${fullName}?\n\nThis action cannot be undone.`)) {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.deleteStudent(student.id);
                
                if (result && result.success) {
                    console.log('Student deleted successfully:', student.id);
                    // Reload the current page to refresh the list
                    loadStudents(currentPage);
                } else {
                    console.error('Failed to delete student:', result?.message);
                    alert(`Failed to delete student: ${result?.message || 'Unknown error'}`);
                }
            } else {
                console.error('Electron API not available');
                alert('Cannot delete student: Application API not available');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert(`Error deleting student: ${error.message}`);
        }
    }
}

// Trigger search/filter with pagination
function triggerSearch() {
    const searchInput = document.getElementById('student-search');
    currentSearchTerm = searchInput ? searchInput.value : '';
    currentGradeFilter = window.currentGradeFilter || '';
    currentRfidFilter = window.currentRfidFilter || '';
    
    // Reset to page 1 when searching/filtering
    loadStudents(1);
}

export function setupSearchAndFilter() {
    const searchInput = document.getElementById('student-search');

    // Initialize global filter variables
    window.currentGradeFilter = '';
    window.currentRfidFilter = '';

    // Debounce search input
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(triggerSearch, 300);
    });

    // Setup dropdown menu event listeners
    document.querySelectorAll('[data-grade]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.currentGradeFilter = e.target.getAttribute('data-grade');
            updateDropdownText('Grade Level', e.target.textContent);
            triggerSearch();
        });
    });

    document.querySelectorAll('[data-rfid]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.currentRfidFilter = e.target.getAttribute('data-rfid');
            updateDropdownText('RFID Assignment', e.target.textContent);
            triggerSearch();
        });
    });

    // Setup pagination controls
    setupPaginationControls();

    // Setup export functionality
    setupExportFunctionality();
}

function updateDropdownText(menuType, selectedText) {
    const defaultTexts = {
        'Grade Level': 'Grades',
        'RFID Assignment': 'RFID'
    };

    const linkToUpdate = Array.from(document.querySelectorAll('.filter-menu-link'))
        .find(link => link.dataset.menuType === menuType);

    if (linkToUpdate) {
        if (selectedText === 'All Grades' || selectedText === 'All') {
            linkToUpdate.textContent = defaultTexts[menuType];
        } else {
            linkToUpdate.textContent = selectedText;
        }
    }
}

// Function to show student info view
async function showStudentInfo(student) {
    console.log('Opening student info for:', student);

    // Get the container where we'll load the student info view
    const studentTableContainer = document.querySelector('.student-table-container');

    // Remember current content so we can restore it later
    const originalContent = studentTableContainer.innerHTML;

    try {
        // Load student-info.html
        const response = await fetch('student-info.html');
        if (!response.ok) {
            throw new Error(`Failed to load student-info.html: ${response.status}`);
        }

        const html = await response.text();

        // Replace the student table with the student info form
        studentTableContainer.innerHTML = html;

        // Set student info view as active
        isStudentInfoViewActive = true;

        // Populate form with student data
        document.getElementById('student-id').value = student.id || '';
        document.getElementById('student-lrn').value = student.lrn || '';
        document.getElementById('student-grade-level').value = student.grade_level || '';
<<<<<<< HEAD
        document.getElementById('student-section').value = student.section || '';
=======
>>>>>>> origin/main
        document.getElementById('student-first-name').value = student.first_name || '';
        document.getElementById('student-middle-name').value = student.middle_name || '';
        document.getElementById('student-last-name').value = student.last_name || '';
        document.getElementById('student-suffix').value = student.suffix || '';
        document.getElementById('student-rfid').value = student.rfid || '';

        // Set up button event listeners
        setupStudentInfoButtons(originalContent, studentTableContainer);

        // Set up RFID input handling for keyboard wedge reader
        setupRfidInput();

        // Set up RFID help tooltip
        setupRfidTooltip();

        // Enable all inputs immediately for editing
        const inputs = document.querySelectorAll('.field-input');
        inputs.forEach((input) => {
            input.disabled = false;
            input.readOnly = false;
            input.style.pointerEvents = 'auto';
            input.style.opacity = '1';
            input.tabIndex = 0;
        });

        // Enable save button
        const saveButton = document.getElementById('btn-save');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.cursor = 'pointer';
        }


    } catch (error) {
        console.error('Error loading student info:', error);
        alert('Failed to load student information view: ' + error.message);
    }
}

function setupStudentInfoButtons(originalContent, studentTableContainer) {
    const backButton = document.getElementById('btn-back-to-list');
    const cancelButton = document.getElementById('btn-cancel');
    const saveButton = document.getElementById('btn-save');
    const scanRfidButton = document.getElementById('btn-scan-rfid');

    // Back and cancel buttons
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Reset student info view state
            isStudentInfoViewActive = false;
            studentTableContainer.innerHTML = originalContent;
            setupSearchAndFilter(); // Re-setup event listeners
            loadStudents();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Reset student info view state
            isStudentInfoViewActive = false;
            studentTableContainer.innerHTML = originalContent;
            setupSearchAndFilter(); // Re-setup event listeners
            loadStudents();
        });
    }

    // Save button functionality
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            try {
                const studentId = document.getElementById('student-id').value;
                const updatedData = {
                    lrn: document.getElementById('student-lrn').value,
                    grade_level: document.getElementById('student-grade-level').value,
<<<<<<< HEAD
                    section: document.getElementById('student-section').value,
=======
>>>>>>> origin/main
                    first_name: document.getElementById('student-first-name').value,
                    middle_name: document.getElementById('student-middle-name').value,
                    last_name: document.getElementById('student-last-name').value,
                    suffix: document.getElementById('student-suffix').value,
                    rfid: document.getElementById('student-rfid').value
                };

                if (window.electronAPI) {
                    const result = await window.electronAPI.updateStudent(studentId, updatedData);

                    if (result && result.success) {
                        // Reset student info view state
                        isStudentInfoViewActive = false;
                        studentTableContainer.innerHTML = originalContent;
                        setupSearchAndFilter(); // Re-setup event listeners
                        loadStudents();
                    } else {
                        console.error('Failed to update student information.');
                    }
                } else {
                    console.error('Electron API not available');
                    alert('Cannot save student information: Application API not available');
                }
            } catch (error) {
                console.error('Error saving student data:', error);
                alert('Error saving student data: ' + error.message);
            }
        });
    }

}

// Setup pagination control event listeners
function setupPaginationControls() {
    // Page size selector
    const pageSizeSelect = document.getElementById('page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            currentPageSize = parseInt(e.target.value);
            loadStudents(1); // Reset to page 1 when changing page size
        });
    }

    // Navigation buttons
    const prevPageBtn = document.getElementById('btn-prev-page');
    const nextPageBtn = document.getElementById('btn-next-page');

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                loadStudents(currentPage - 1);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                loadStudents(currentPage + 1);
            }
        });
    }
}

// Update pagination controls based on current state
function updatePaginationControls(pagination) {
    const prevPageBtn = document.getElementById('btn-prev-page');
    const nextPageBtn = document.getElementById('btn-next-page');
    const pageNumbers = document.getElementById('page-numbers');

    // Update button states
    if (prevPageBtn) prevPageBtn.disabled = !pagination.hasPrevPage;
    if (nextPageBtn) nextPageBtn.disabled = !pagination.hasNextPage;

    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        const pageNumberElements = generatePageNumbers(pagination);
        pageNumberElements.forEach(element => {
            pageNumbers.appendChild(element);
        });
    }
}

// Generate page number elements
function generatePageNumbers(pagination) {
    const elements = [];
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 1) return elements;
    
    // For pages 1-3: show < 1 2 3 ... max >
    if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            elements.push(createPageNumberElement(i, i === currentPage));
        }
        
        if (totalPages > 3) {
            elements.push(createEllipsisElement());
            elements.push(createPageNumberElement(totalPages, false));
        }
    }
    // For last 3 pages: show < 1 ... (max-2) (max-1) max >
    else if (currentPage >= totalPages - 2) {
        elements.push(createPageNumberElement(1, false));
        
        if (totalPages > 4) {
            elements.push(createEllipsisElement());
        }
        
        for (let i = Math.max(totalPages - 2, 2); i <= totalPages; i++) {
            elements.push(createPageNumberElement(i, i === currentPage));
        }
    }
    // For middle pages: show < 1 ... current current+1 ... max >
    else {
        elements.push(createPageNumberElement(1, false));
        elements.push(createEllipsisElement());
        
        // Show only current page and next page (2 pages total)
        elements.push(createPageNumberElement(currentPage, true));
        if (currentPage < totalPages) {
            elements.push(createPageNumberElement(currentPage + 1, false));
        }
        
        elements.push(createEllipsisElement());
        elements.push(createPageNumberElement(totalPages, false));
    }
    
    return elements;
}

// Create page number element
function createPageNumberElement(pageNum, isActive) {
    const element = document.createElement('button');
    element.className = `page-btn ${isActive ? 'active' : ''}`;
    element.textContent = pageNum;
    element.addEventListener('click', () => {
        if (!isActive) {
            loadStudents(pageNum);
        }
    });
    return element;
}

// Create ellipsis element
function createEllipsisElement() {
    const element = document.createElement('span');
    element.className = 'page-ellipsis';
    element.textContent = '...';
    return element;
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

// Setup export functionality
function setupExportFunctionality() {
    const exportButton = document.querySelector('.export-section button');
    if (exportButton) {
        exportButton.addEventListener('click', handleExport);
    }
}

// Handle export functionality
async function handleExport() {
    try {
        // Show loading state
        const exportButton = document.querySelector('.export-section button');
        const originalText = exportButton.textContent;
        exportButton.textContent = 'Exporting...';
        exportButton.disabled = true;

        // Get all students (not paginated) for export
        const result = await window.electronAPI.getStudentsPaginated(
            1,
            10000, // Large number to get all students
            '', // No search term
            '', // No grade filter
            ''  // No RFID filter
        );

        if (!result || !result.students) {
            throw new Error('Failed to fetch student data for export');
        }

        // Create export options
        const exportOptions = [
<<<<<<< HEAD
            { label: 'Export as Excel', action: () => exportAsExcel(result.students) },
            { label: 'Export as PDF', action: () => exportAsPDF(result.students) },
            { label: 'Export SF2 Attendance', action: () => showSF2ExportModal() }
=======
            { label: 'Export as CSV', action: () => exportAsCSV(result.students) },
            { label: 'Export as PDF', action: () => exportAsPDF(result.students) }
>>>>>>> origin/main
        ];

        // Show export dialog
        showExportDialog(exportOptions);

        // Reset button
        exportButton.textContent = originalText;
        exportButton.disabled = false;

    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed: ' + error.message);

        // Reset button
        const exportButton = document.querySelector('.export-section button');
        if (exportButton) {
            exportButton.textContent = 'Export';
            exportButton.disabled = false;
        }
    }
}

// Show export dialog with options
function showExportDialog(options) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
<<<<<<< HEAD
=======
        border-radius: 8px;
>>>>>>> origin/main
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        min-width: 300px;
    `;

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Export Students';
    title.style.cssText = 'margin: 0 0 20px 0; color: #333;';
    modalContent.appendChild(title);

    // Options
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.label;
        button.style.cssText = `
            display: block;
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
<<<<<<< HEAD
=======
            border-radius: 4px;
>>>>>>> origin/main
            background: #f8f9fa;
            cursor: pointer;
            transition: background 0.2s;
        `;
        button.addEventListener('mouseover', () => button.style.background = '#e9ecef');
        button.addEventListener('mouseout', () => button.style.background = '#f8f9fa');
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
            option.action();
        });
        modalContent.appendChild(button);
    });

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        display: block;
        width: 100%;
        padding: 10px;
        margin: 15px 0 0 0;
        border: 1px solid #6c757d;
<<<<<<< HEAD
=======
        border-radius: 4px;
>>>>>>> origin/main
        background: #6c757d;
        color: white;
        cursor: pointer;
    `;
    cancelButton.addEventListener('click', () => document.body.removeChild(modal));
    modalContent.appendChild(cancelButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

<<<<<<< HEAD
// Show export success modal
function showExportSuccessModal(filePath) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        min-width: 300px;
        max-width: 400px;
    `;

    // Header with success icon
    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 15px;';

    const icon = document.createElement('div');
    icon.innerHTML = '✅';
    icon.style.cssText = 'font-size: 36px; margin-bottom: 8px;';
    header.appendChild(icon);

    const title = document.createElement('h2');
    title.textContent = 'Export Successful!';
    title.style.cssText = 'margin: 0; color: #10B981; font-size: 20px;';
    header.appendChild(title);

    modalContent.appendChild(header);

    // Body with file path
    const body = document.createElement('div');
    body.style.cssText = 'margin-bottom: 15px; text-align: center;';

    const pathLabel = document.createElement('p');
    pathLabel.textContent = 'File saved to:';
    pathLabel.style.cssText = 'margin: 10px 0 5px 0; font-weight: bold; color: #333; font-size: 14px;';

    const pathDisplay = document.createElement('div');
    pathDisplay.textContent = filePath;
    pathDisplay.style.cssText = `
        background: #f8f9fa;
        padding: 8px;
        font-family: monospace;
        font-size: 11px;
        word-break: break-all;
        color: #495057;
        border: 1px solid #dee2e6;
    `;

    body.appendChild(pathLabel);
    body.appendChild(pathDisplay);
    modalContent.appendChild(body);

    // Footer with OK button
    const footer = document.createElement('div');
    footer.style.cssText = 'text-align: center;';

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
        background-color: #10B981;
        color: white;
        border: 1px solid #10B981;
        padding: 8px 25px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: background-color 0.2s;
    `;
    okButton.addEventListener('mouseover', () => okButton.style.backgroundColor = '#059669');
    okButton.addEventListener('mouseout', () => okButton.style.backgroundColor = '#10B981');
    okButton.addEventListener('click', () => document.body.removeChild(modal));

    footer.appendChild(okButton);
    modalContent.appendChild(footer);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Export as CSV (working fallback)
=======
// Export as CSV
>>>>>>> origin/main
function exportAsCSV(students) {
    const headers = ['LRN', 'First Name', 'Middle Name', 'Last Name', 'Suffix', 'Grade Level', 'RFID'];
    const csvContent = [
        headers.join(','),
        ...students.map(student => [
            student.lrn || '',
            student.first_name || '',
            student.middle_name || '',
            student.last_name || '',
            student.suffix || '',
            student.grade_level || '',
            student.rfid || ''
        ].map(field => `"${field}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'students.csv', 'text/csv');
}

<<<<<<< HEAD
// Export as Excel using main process (shows save dialog)
async function exportAsExcel(students) {
    try {
        if (!window.electronAPI || !window.electronAPI.exportStudentsExcel) {
            throw new Error('Excel export API not available');
        }

        const result = await window.electronAPI.exportStudentsExcel(students);

        if (result.success) {
            console.log('Excel export completed successfully:', result.filePath);
            showExportSuccessModal(result.filePath);
        } else {
            if (result.message !== 'Export cancelled by user') {
                throw new Error(result.message);
            }
        }

    } catch (error) {
        console.error('Excel export failed:', error);
        alert('Excel export failed: ' + error.message);
    }
}

=======
>>>>>>> origin/main
// Export as PDF using browser print
function exportAsPDF(students) {
    // Create a printable HTML document
    const printWindow = window.open('', '_blank');
    const htmlContent = generatePrintableHTML(students);

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function() {
        printWindow.print();
        // Close the print window after printing (optional)
        // printWindow.close();
    };
}

// Generate printable HTML for PDF export
function generatePrintableHTML(students) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student List - ${currentDate}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                .header h1 {
                    margin: 0;
                    color: #2c3e50;
                }
                .header p {
                    margin: 5px 0;
                    color: #7f8c8d;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    color: #2c3e50;
                }
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #7f8c8d;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Student List Report</h1>
                <p>Generated on ${currentDate} at ${currentTime}</p>
                <p>Total Students: ${students.length}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>LRN</th>
                        <th>Name</th>
                        <th>Grade Level</th>
                        <th>RFID Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => {
                        const fullName = `${student.first_name || ''} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name || ''} ${student.suffix || ''}`.trim();
                        const rfidStatus = student.rfid ? student.rfid : 'Not Assigned';
                        return `
                            <tr>
                                <td>${student.lrn || 'N/A'}</td>
                                <td>${fullName}</td>
                                <td>${student.grade_level || 'N/A'}</td>
                                <td>${rfidStatus}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>Generated by SAMS Desktop Application</p>
            </div>
        </body>
        </html>
    `;
}

<<<<<<< HEAD
// Show SF2 export modal
async function showSF2ExportModal() {
    try {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            min-width: 400px;
            max-width: 500px;
        `;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Export SF2 Attendance';
        title.style.cssText = 'margin: 0 0 20px 0; color: #333;';
        modalContent.appendChild(title);

        // Grade Level selector
        const gradeLabel = document.createElement('label');
        gradeLabel.textContent = 'Grade Level:';
        gradeLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
        modalContent.appendChild(gradeLabel);

        const gradeSelect = document.createElement('select');
        gradeSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            font-size: 14px;
        `;
        gradeSelect.innerHTML = '<option value="">Loading...</option>';
        modalContent.appendChild(gradeSelect);

        // Section selector
        const sectionLabel = document.createElement('label');
        sectionLabel.textContent = 'Section:';
        sectionLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
        modalContent.appendChild(sectionLabel);

        const sectionSelect = document.createElement('select');
        sectionSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            font-size: 14px;
        `;
        sectionSelect.innerHTML = '<option value="">Select grade level first</option>';
        sectionSelect.disabled = true;
        modalContent.appendChild(sectionSelect);

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        // Export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export';
        exportButton.style.cssText = `
            background-color: #10B981;
            color: white;
            border: 1px solid #10B981;
            padding: 8px 20px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        exportButton.disabled = true;

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            background-color: #6c757d;
            color: white;
            border: 1px solid #6c757d;
            padding: 8px 20px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
        `;

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(exportButton);
        modalContent.appendChild(buttonsContainer);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Load grade levels
        try {
            const gradeResult = await window.electronAPI.getUniqueGradeLevels();
            if (gradeResult.success) {
                gradeSelect.innerHTML = '<option value="">Select Grade Level</option>';
                gradeResult.gradeLevels.forEach(grade => {
                    const option = document.createElement('option');
                    option.value = grade;
                    option.textContent = grade;
                    gradeSelect.appendChild(option);
                });
            } else {
                gradeSelect.innerHTML = '<option value="">Error loading grades</option>';
            }
        } catch (error) {
            console.error('Failed to load grade levels:', error);
            gradeSelect.innerHTML = '<option value="">Error loading grades</option>';
        }

        // Handle grade level change
        gradeSelect.addEventListener('change', async () => {
            const selectedGrade = gradeSelect.value;
            if (selectedGrade) {
                sectionSelect.innerHTML = '<option value="">Loading...</option>';
                sectionSelect.disabled = true;

                try {
                    const sectionResult = await window.electronAPI.getUniqueSections(selectedGrade);
                    if (sectionResult.success) {
                        sectionSelect.innerHTML = '<option value="">Select Section</option>';
                        sectionResult.sections.forEach(section => {
                            const option = document.createElement('option');
                            option.value = section;
                            option.textContent = section;
                            sectionSelect.appendChild(option);
                        });
                        sectionSelect.disabled = false;
                    } else {
                        sectionSelect.innerHTML = '<option value="">No sections found</option>';
                    }
                } catch (error) {
                    console.error('Failed to load sections:', error);
                    sectionSelect.innerHTML = '<option value="">Error loading sections</option>';
                }
            } else {
                sectionSelect.innerHTML = '<option value="">Select grade level first</option>';
                sectionSelect.disabled = true;
            }
            updateExportButton();
        });

        // Handle section change
        sectionSelect.addEventListener('change', updateExportButton);

        function updateExportButton() {
            exportButton.disabled = !gradeSelect.value || !sectionSelect.value;
        }

        // Handle export
        exportButton.addEventListener('click', async () => {
            const gradeLevel = gradeSelect.value;
            const section = sectionSelect.value;

            if (!gradeLevel || !section) return;

            // Disable button and show loading
            exportButton.disabled = true;
            exportButton.textContent = 'Exporting...';

            try {
                const result = await window.electronAPI.exportSF2Attendance(gradeLevel, section);

                if (result.success) {
                    console.log('SF2 export completed successfully:', result.filePath);
                    showExportSuccessModal(result.filePath);
                    document.body.removeChild(modal);
                } else {
                    if (result.message !== 'Export cancelled by user') {
                        alert('SF2 export failed: ' + result.message);
                    }
                }
            } catch (error) {
                console.error('SF2 export failed:', error);
                alert('SF2 export failed: ' + error.message);
            } finally {
                // Re-enable button
                exportButton.disabled = false;
                exportButton.textContent = 'Export';
            }
        });

        // Handle cancel
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

    } catch (error) {
        console.error('Failed to show SF2 export modal:', error);
        alert('Failed to open SF2 export dialog: ' + error.message);
    }
}

=======
>>>>>>> origin/main
// Helper function to download file
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


