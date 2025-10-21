// Header loader utility
import { initializeLogout } from './logout.js';

export async function loadHeader() {
    try {
        const response = await fetch('../components/header.html');
        const headerHTML = await response.text();
        
        // Find the header placeholder or create one
        let headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            headerContainer = document.createElement('div');
            headerContainer.id = 'header-container';
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
        
        headerContainer.innerHTML = headerHTML;
        
        // Initialize logout functionality using centralized module
        initializeLogout();
        
        console.log('Header loaded successfully');
    } catch (error) {
        console.error('Failed to load header:', error);
    }
}

