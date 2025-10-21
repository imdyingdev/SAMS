// Logs page functionality as ES6 module
import { initializeLogout } from './logout.js';

// Logs state
let currentLogsPage = 1;
let currentLogsPageSize = 50;
let currentLogsSearchTerm = '';
let currentLogTypeFilter = '';
let currentDateFilter = '';
let totalLogsPages = 1;
let totalLogs = 0;

export function initializeLogsPage() {
    console.log('Logs page script initialized');

    // Initialize logout functionality
    initializeLogout();

    // Initialize logs table visibility
    initializeLogsVisibility();

    // Check if Electron API is available
    if (window.electronAPI) {
        console.log('✅ Electron API available for logs');
    } else {
        console.warn('⚠️ Electron API not available for logs');
    }
}

// Initialize logs visibility state
function initializeLogsVisibility() {
    const logsListContainer = document.getElementById('logs-list-container');
    const statusIndicator = document.getElementById('logs-status-indicator');
    const paginationContainer = document.getElementById('logs-pagination-container');
    
    // Show loading state initially
    showLogsStatus('loading', 'Loading logs...', 'Please wait while we fetch the activity logs.');
    
    if (logsListContainer) {
        logsListContainer.style.display = 'none';
    }
    
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }
}

export async function loadLogs(page = 1, resetFilters = false) {
    console.log(`Requesting logs page ${page}...`);
    const logsListContainer = document.getElementById('logs-list-container');
    const statusIndicator = document.getElementById('logs-status-indicator');
    const paginationContainer = document.getElementById('logs-pagination-container');

    // No filters since we removed search and filter UI
    currentLogsSearchTerm = '';
    currentLogTypeFilter = '';
    currentDateFilter = '';

    // Update current page
    currentLogsPage = page;

    // Show loading state
    showLogsStatus('loading', 'Loading logs...', 'Please wait while we fetch the activity logs.');
    
    // Hide logs list initially
    if (logsListContainer) {
        logsListContainer.style.display = 'none';
    }

    try {
        const result = await window.electronAPI.getLogsPaginated(
            currentLogsPage, 
            currentLogsPageSize, 
            currentLogsSearchTerm, 
            currentLogTypeFilter, 
            currentDateFilter
        );
        console.log('Received paginated logs data:', result);

        if (!result || !result.logs || !Array.isArray(result.logs)) {
            throw new Error('Invalid logs data received from main process.');
        }

        const { logs, pagination, summary } = result;
        
        // Update pagination state
        totalLogsPages = pagination.totalPages;
        totalLogs = pagination.totalLogs;
        currentLogsPage = pagination.currentPage;

        if (logs.length === 0) {
            // Show no results status
            const title = totalLogs === 0 ? 'No Logs Found.' : 'No Results Found.';
            const message = totalLogs === 0 
                ? 'No activity logs have been recorded yet.' 
                : 'No logs match your current search criteria. Try adjusting your filters.';
            
            showLogsStatus('no-results', title, message);
            
            // Keep logs list hidden when no results
            if (logsListContainer) {
                logsListContainer.style.display = 'none';
            }
            
            // Update pagination controls even with no results on current page
            if (totalLogs > 0) {
                updateLogsPaginationControls(pagination);
                if (paginationContainer) paginationContainer.style.display = 'flex';
            }
            return;
        }

        // Hide status indicator when we have results
        hideLogsStatus();
        
        // Show logs summary and list, hide status indicator
        const logsSummary = document.getElementById('logs-summary');
        if (logsSummary) {
            logsSummary.style.display = 'grid';
        }
        if (logsListContainer) {
            logsListContainer.style.display = 'flex';
        }
        if (statusIndicator) {
            statusIndicator.style.display = 'none';
        }
        updateLogsSummary(summary);
        
        // Render logs
        renderLogs(logs);
        
        // Update pagination controls
        updateLogsPaginationControls(pagination);
        if (paginationContainer) paginationContainer.style.display = 'flex';
        
    } catch (error) {
        console.error('Failed to load logs:', error);
        
        // Show error status
        showLogsStatus('error', 'Error Loading Logs', `Failed to load activity logs: ${error.message}`);
        
        // Hide logs list
        if (logsListContainer) {
            logsListContainer.style.display = 'none';
        }
        
        // Keep pagination visible if we had pages before the error
        if (totalLogsPages > 1) {
            if (paginationContainer) paginationContainer.style.display = 'flex';
            updateLogsPaginationControls({
                currentPage: currentLogsPage,
                totalPages: totalLogsPages,
                hasPrevPage: currentLogsPage > 1,
                hasNextPage: currentLogsPage < totalLogsPages,
                totalLogs: totalLogs
            });
        } else {
            if (paginationContainer) paginationContainer.style.display = 'none';
        }
    }
}

// Logs status indicator functions
function showLogsStatus(type, title, message) {
    const statusIndicator = document.getElementById('logs-status-indicator');
    const statusTitle = document.getElementById('logs-status-title');
    const statusMessage = document.getElementById('logs-status-message');
    const statusSpinner = document.getElementById('logs-status-spinner');
    const statusSearchIcon = document.getElementById('logs-status-search-icon');
    const statusErrorIcon = document.getElementById('logs-status-error-icon');
    
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

function hideLogsStatus() {
    const statusIndicator = document.getElementById('logs-status-indicator');
    if (statusIndicator) {
        statusIndicator.style.display = 'none';
    }
}

function updateLogsSummary(summary) {
    const timeInCount = document.getElementById('time-in-count');
    const timeOutCount = document.getElementById('time-out-count');
    const totalLogsCount = document.getElementById('total-logs-count');
    
    if (timeInCount) timeInCount.textContent = summary.timeInToday || 0;
    if (timeOutCount) timeOutCount.textContent = summary.timeOutToday || 0;
    if (totalLogsCount) totalLogsCount.textContent = summary.totalLogs || 0;
}

function renderLogs(logs) {
    const logsList = document.getElementById('logs-list');
    
    if (!logsList) return;
    
    logsList.innerHTML = '';
    
    logs.forEach(log => {
        const logEntryHTML = renderLogEntry(log);
        logsList.insertAdjacentHTML('beforeend', logEntryHTML);
    });
}

function getStudentInitials(fullName) {
    if (!fullName || fullName === '(N/A)') return 'NA';
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) return fullName.charAt(0).toUpperCase();
    
    // Get first letter of first name and first letter of last name
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    
    return firstInitial + lastInitial;
}

function renderLogEntry(log) {
    const logType = log.log_type || 'unknown';
    const studentName = log.student_name || '(N/A)';
    const gradeLevel = log.grade_level || '';
    const rfid = log.rfid || 'N/A';
    const timestamp = new Date(log.timestamp);
    
    const iconClass = getLogTypeClass(logType);
    const actionText = logType === 'time_in' ? 'Time In' : 'Time Out';
    
    // Generate student initials
    const studentInitials = getStudentInitials(studentName);
    
    // Format student display name
    const displayName = studentName === '(N/A)' ? '(N/A)' : 
        gradeLevel ? `${studentName} (${gradeLevel})` : studentName;
    
    // Format timestamp
    const formattedTimestamp = timestamp.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    return `
        <div class="log-entry">
            <div class="log-icon ${iconClass}">
                ${studentInitials}
            </div>
            <div class="log-details">
                <div class="log-student-name">${displayName}</div>
                <div class="log-actions-container">
                    <div class="log-rfid-container">
                        <span class="log-rfid">RFID: ${rfid}</span>
                    </div>
                    <div class="log-action-container">
                        <span class="log-action ${logType}">${actionText}</span>
                    </div>
                </div>
            </div>
            <div class="log-timestamp">
                ${formattedTimestamp}
            </div>
        </div>
    `;
}
function getLogTypeIcon(logType) {
    const icons = {
        'time_in': 'bx bx-log-in',
        'time_out': 'bx bx-log-out',
        'student_added': 'bx bx-user-plus',
        'student_updated': 'bx bx-user-check',
        'student_deleted': 'bx bx-user-minus',
        'login': 'bx bx-lock-open',
        'logout': 'bx bx-lock',
        'system': 'bx bx-cog'
    };
    return icons[logType] || 'bx bx-info-circle';
}

function getLogTypeClass(logType) {
    const classes = {
        'time_in': 'time-in',
        'time_out': 'time-out',
        'student_added': 'student-action',
        'student_updated': 'student-action',
        'student_deleted': 'student-action',
        'login': 'auth-action',
        'logout': 'auth-action',
        'system': 'system-action'
    };
    return classes[logType] || 'default-action';
}

function getLogDescription(log) {
    const descriptions = {
        'time_in': 'Student Time In',
        'time_out': 'Student Time Out',
        'student_added': 'New Student Added',
        'student_updated': 'Student Information Updated',
        'student_deleted': 'Student Removed',
        'login': 'Administrator Login',
        'logout': 'Administrator Logout',
        'system': 'System Activity'
    };
    return descriptions[log.log_type] || 'Unknown Activity';
}

export function setupLogsSearchAndFilter() {
    // No search and filter UI, just setup pagination controls
    setupLogsPaginationControls();
}

// Setup pagination control event listeners
function setupLogsPaginationControls() {
    // Page size selector
    const pageSizeSelect = document.getElementById('logs-page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            currentLogsPageSize = parseInt(e.target.value);
            loadLogs(1); // Reset to page 1 when changing page size
        });
    }

    // Navigation buttons
    const prevPageBtn = document.getElementById('btn-prev-logs-page');
    const nextPageBtn = document.getElementById('btn-next-logs-page');

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentLogsPage > 1) {
                loadLogs(currentLogsPage - 1);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentLogsPage < totalLogsPages) {
                loadLogs(currentLogsPage + 1);
            }
        });
    }
}

// Update pagination controls based on current state
function updateLogsPaginationControls(pagination) {
    const prevPageBtn = document.getElementById('btn-prev-logs-page');
    const nextPageBtn = document.getElementById('btn-next-logs-page');
    const pageNumbers = document.getElementById('logs-page-numbers');

    // Update button states
    if (prevPageBtn) prevPageBtn.disabled = !pagination.hasPrevPage;
    if (nextPageBtn) nextPageBtn.disabled = !pagination.hasNextPage;

    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        const pageNumberElements = generateLogsPageNumbers(pagination);
        pageNumberElements.forEach(element => {
            pageNumbers.appendChild(element);
        });
    }
}

// Generate page number elements for logs
function generateLogsPageNumbers(pagination) {
    const elements = [];
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 1) return elements;
    
    // For pages 1-3: show < 1 2 3 ... max >
    if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            elements.push(createLogsPageNumberElement(i, i === currentPage));
        }
        
        if (totalPages > 3) {
            elements.push(createLogsEllipsisElement());
            elements.push(createLogsPageNumberElement(totalPages, false));
        }
    }
    // For last 3 pages: show < 1 ... (max-2) (max-1) max >
    else if (currentPage >= totalPages - 2) {
        elements.push(createLogsPageNumberElement(1, false));
        
        if (totalPages > 4) {
            elements.push(createLogsEllipsisElement());
        }
        
        for (let i = Math.max(totalPages - 2, 2); i <= totalPages; i++) {
            elements.push(createLogsPageNumberElement(i, i === currentPage));
        }
    }
    // For middle pages: show < 1 ... current current+1 ... max >
    else {
        elements.push(createLogsPageNumberElement(1, false));
        elements.push(createLogsEllipsisElement());
        
        // Show only current page and next page (2 pages total)
        elements.push(createLogsPageNumberElement(currentPage, true));
        if (currentPage < totalPages) {
            elements.push(createLogsPageNumberElement(currentPage + 1, false));
        }
        
        elements.push(createLogsEllipsisElement());
        elements.push(createLogsPageNumberElement(totalPages, false));
    }
    
    return elements;
}

// Create page number element for logs
function createLogsPageNumberElement(pageNum, isActive) {
    const element = document.createElement('button');
    element.className = `page-btn ${isActive ? 'active' : ''}`;
    element.textContent = pageNum;
    element.addEventListener('click', () => {
        if (!isActive) {
            loadLogs(pageNum);
        }
    });
    return element;
}

// Create ellipsis element for logs
function createLogsEllipsisElement() {
    const element = document.createElement('span');
    element.className = 'page-ellipsis';
    element.textContent = '...';
    return element;
}
