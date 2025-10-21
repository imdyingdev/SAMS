// Main SPA application controller
import { initializeDashboard } from './dashboard.js';
import { initializeStudentsPage, loadStudents, setupSearchAndFilter } from './students.js';
import { initializeLogsPage, loadLogs, setupLogsSearchAndFilter } from './logs.js';
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
    logs: {
        template: '../view-components/logs-view.html',
        title: 'Activity Logs',
        init: initializeLogsView,
        cleanup: cleanupLogsView
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
    }, 100);
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

function cleanupLogsView() {
    console.log('🧹 Cleaning up logs view...');
    // No search input to cleanup since we removed it
}

// Helper function for student search (if needed)
function handleStudentSearch(event) {
    // This would be handled by the students.js module
    console.log('Search:', event.target.value);
}
