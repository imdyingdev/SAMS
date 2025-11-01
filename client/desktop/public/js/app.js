// Main SPA application controller
import { initializeDashboard } from './dashboard.js';
import { initializeStudentsPage, loadStudents, setupSearchAndFilter } from './students.js';
import { initializeAddStudentPage } from './add-student.js';
import { initializeLogsPage, loadLogs, setupLogsSearchAndFilter } from './logs.js';
import { initializeAnnouncementsPage, loadAnnouncements, setupAnnouncementsSearch } from './announcements.js';
import { initializeSettingsPage } from './settings.js';
import { initializeDashboardAnnouncements, loadDashboardAnnouncements } from './dashboard-announcements.js';
import { initializeDashboardAttendance, loadTodayAttendanceStats } from './dashboard-attendance.js';
import { loadComponent } from './componentLoader.js';

// View configurations
const views = {
    home: {
        template: '../view-components/home-view.html',
        title: 'Dashboard',
        init: initializeHomeView,
        cleanup: cleanupHomeView
    },
    students: {
        template: '../view-components/students-view.html',
        title: 'Students',
        init: initializeStudentsView,
        cleanup: cleanupStudentsView
    },
    'add-student': {
        template: '../view-components/add-student-view.html',
        title: 'Add Student',
        init: initializeAddStudentView,
        cleanup: cleanupAddStudentView
    },
    logs: {
        template: '../view-components/logs-view.html',
        title: 'Activity Logs',
        init: initializeLogsView,
        cleanup: cleanupLogsView
    },
    announcements: {
        template: '../view-components/announcements-view.html',
        title: 'Announcements',
        init: initializeAnnouncementsView,
        cleanup: cleanupAnnouncementsView
    },
    settings: {
        template: '../view-components/settings-view.html',
        title: 'Settings',
        init: initializeSettingsView,
        cleanup: cleanupSettingsView
    }
};

let currentView = null;

// Initialize the SPA
export function initializeApp() {
    console.log('🚀 Initializing SPA...');
    setupNavigation();
    
    // Set up global navigation handlers
    window.navigateToView = navigateToView;
    
    // Handle initial URL hash routing
    handleInitialRoute();
}

// Handle initial route based on URL hash
function handleInitialRoute() {
    const hash = window.location.hash.substring(1); // Remove the #
    if (hash && views[hash]) {
        console.log(`🔗 Initial route detected: ${hash}`);
        // Small delay to ensure DOM is ready
        setTimeout(() => navigateToView(hash), 100);
    }
}

// Navigate to a specific view
export async function navigateToView(viewName) {
    console.log(`📍 Navigating to: ${viewName}`);
    
    // Check if we're already on this view
    if (currentView === viewName) {
        console.log(`ℹ️ Already on ${viewName} view, skipping navigation`);
        return;
    }
    
    const view = views[viewName];
    if (!view) {
        console.error(`❌ View '${viewName}' not found`);
        return;
    }

    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('❌ Main content container not found');
        return;
    }

    // 1. Fade out the current content
    mainContent.classList.add('fade-out');

    // Wait for the transition to finish (200ms matches shared-styles.css)
    await new Promise(resolve => setTimeout(resolve, 200));

    // 2. Cleanup current view after fade-out
    if (currentView && views[currentView].cleanup) {
        views[currentView].cleanup();
    }

    try {
        // 3. Load new view content
        const response = await fetch(view.template);
        if (!response.ok) {
            throw new Error(`Failed to load view: ${response.statusText}`);
        }
        const html = await response.text();

        // 4. Update the DOM
        mainContent.innerHTML = html;

        // 5. Initialize the new view
        if (view.init) {
            await view.init();
        }

        // Update page title and active navigation
        document.title = `${view.title} - AMPID Attendance System`;
        updateActiveNavigation(viewName);
        currentView = viewName;

        // 6. Fade in the new content
        mainContent.classList.remove('fade-out');

        console.log(`✅ Successfully loaded ${viewName} view`);

    } catch (error) {
        console.error(`❌ Error loading view ${viewName}:`, error);
        // Restore visibility on error
        mainContent.classList.remove('fade-out');
    }
}

// Setup navigation event handlers
function setupNavigation() {
    // Setup navigation click handlers
    document.addEventListener('click', (e) => {
        const navItem = e.target.closest('[data-nav]');
        if (navItem) {
            e.preventDefault();
            const viewName = navItem.getAttribute('data-nav');
            navigateToView(viewName);
        }
    });

    console.log('✅ Navigation setup complete');
}

// Update active navigation state
function updateActiveNavigation(viewName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current nav item
    const activeNavItem = document.querySelector(`[data-nav="${viewName}"]`);
    if (activeNavItem) {
        const navItem = activeNavItem.closest('.nav-item');
        if (navItem) {
            navItem.classList.add('active');
        }
    }
}

// View initialization functions
async function initializeHomeView() {
    console.log('🏠 Initializing home view...');
    
    // Initialize dashboard functionality
    initializeDashboard();
    
    // Load calendar component
    await loadComponent('calendar', 'calendar-container');
    
    // Initialize dashboard announcements
    initializeDashboardAnnouncements();
    
    // Initialize dashboard attendance
    initializeDashboardAttendance();
    
    // Initialize charts with delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof window.initializeStudentChart === 'function') {
            window.initializeStudentChart();
        }
        if (typeof window.initializeGenderChart === 'function') {
            window.initializeGenderChart();
        }
        if (typeof window.initDailyAttendanceChart === 'function') {
            window.initDailyAttendanceChart();
        }
        
        // Load dashboard announcements
        loadDashboardAnnouncements();
        
        // Load today's attendance stats
        console.log('Explicitly loading today\'s attendance stats...');
        loadTodayAttendanceStats();
    }, 300); // Increased timeout to ensure DOM is fully ready
}

async function initializeStudentsView() {
    console.log('👥 Initializing students view...');
    
    // Initialize students page functionality
    initializeStudentsPage();
    setupSearchAndFilter();
    
    // Add a small delay to ensure DOM is ready and visibility states are set
    setTimeout(() => {
        loadStudents();
    }, 50);
}

async function initializeAddStudentView() {
    console.log('➕ Initializing add student view...');

    // Initialize add student page functionality
    initializeAddStudentPage();
}

async function initializeLogsView() {
    console.log('📋 Initializing logs view...');
    
    // Initialize logs page functionality
    initializeLogsPage();
    setupLogsSearchAndFilter();
    
    // Add a small delay to ensure DOM is ready and visibility states are set
    setTimeout(() => {
        loadLogs();
    }, 50);
}

async function initializeAnnouncementsView() {
    console.log('📢 Initializing announcements view...');

    // Initialize announcements page functionality
    initializeAnnouncementsPage();
    setupAnnouncementsSearch();

    // Add a small delay to ensure DOM is ready and visibility states are set
    setTimeout(() => {
        loadAnnouncements();
    }, 50);
}

async function initializeSettingsView() {
    console.log('⚙️ Initializing settings view...');

    // Initialize settings page functionality
    initializeSettingsPage();
}

// View cleanup functions
function cleanupHomeView() {
    console.log('🧹 Cleaning up home view...');
    // Cleanup charts if needed
    const studentChart = document.getElementById('student-chart');
    const genderChart = document.getElementById('gender-chart');
    const dailyAttendanceChart = document.getElementById('daily-attendance-chart');
    
    if (studentChart && window.echarts) {
        const chartInstance = window.echarts.getInstanceByDom(studentChart);
        if (chartInstance) {
            chartInstance.dispose();
        }
    }
    
    if (genderChart && window.echarts) {
        const chartInstance = window.echarts.getInstanceByDom(genderChart);
        if (chartInstance) {
            chartInstance.dispose();
        }
    }
    
    if (dailyAttendanceChart && window.echarts) {
        const chartInstance = window.echarts.getInstanceByDom(dailyAttendanceChart);
        if (chartInstance) {
            chartInstance.dispose();
        }
    }
}

function cleanupStudentsView() {
    console.log('🧹 Cleaning up students view...');
    // Remove any event listeners or cleanup students-specific functionality
    const searchInput = document.getElementById('student-search');
    if (searchInput) {
        // Re-enable the search input in case it was disabled
        searchInput.disabled = false;
        searchInput.readOnly = false;
        searchInput.style.pointerEvents = 'auto';
        searchInput.style.opacity = '1';
        searchInput.removeEventListener('input', handleStudentSearch);
    }
}

function cleanupAddStudentView() {
    console.log('🧹 Cleaning up add student view...');
    // Clear form fields
    const inputs = document.querySelectorAll('#student-first-name, #student-middle-name, #student-last-name, #student-suffix, #student-grade-level, #student-lrn, #student-rfid');
    inputs.forEach(input => {
        input.value = '';
    });
}

function cleanupLogsView() {
    console.log('🧹 Cleaning up logs view...');
    // No search input to cleanup since we removed it
}

function cleanupAnnouncementsView() {
    console.log('🧹 Cleaning up announcements view...');
    // Clean up announcements-specific functionality
    const searchInput = document.getElementById('announcement-search');
    if (searchInput) {
        searchInput.value = '';
    }
}

function cleanupSettingsView() {
    console.log('🧹 Cleaning up settings view...');
    // No specific cleanup needed for settings view
}

// Helper function for student search (if needed)
function handleStudentSearch(event) {
    // This would be handled by the students.js module
    console.log('Search:', event.target.value);
}
