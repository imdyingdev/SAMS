// Dashboard functionality as ES6 module
import { initializeLogout } from './logout.js';

export function initializeDashboard() {
    console.log('Dashboard script initialized');
    
    // Initialize logout functionality
    initializeLogout();
    
    // Initialize charts
    initializeStudentChart();
    initializeGenderChart();
}


// Initialize charts (placeholder functions)
function initializeStudentChart() {
    if (typeof window.initializeStudentChart === 'function') {
        window.initializeStudentChart();
    } else {
        console.log('Student chart function not available');
    }
}

function initializeGenderChart() {
    if (typeof window.initializeGenderChart === 'function') {
        window.initializeGenderChart();
    } else {
        console.log('Gender chart function not available');
    }
}

// Navigation setup (deprecated - now handled by app.js)
export function setupNavigation() {
    console.log('⚠️ Navigation setup called from dashboard.js - this is now handled by app.js');
    // Navigation is now handled by the main app.js SPA controller
}
