// Header loader utility
import { initializeLogout } from './logout.js';

export async function loadHeader() {
    try {
        const response = await fetch('../components/header.html');
        const headerHTML = await response.text();
<<<<<<< HEAD

=======
        
>>>>>>> origin/main
        // Find the header placeholder or create one
        let headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            headerContainer = document.createElement('div');
            headerContainer.id = 'header-container';
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
<<<<<<< HEAD

        headerContainer.innerHTML = headerHTML;

        // Update user role display in header
        updateHeaderUserRole();

        // Initialize logout functionality using centralized module
        initializeLogout();

=======
        
        headerContainer.innerHTML = headerHTML;
        
        // Initialize logout functionality using centralized module
        initializeLogout();
        
>>>>>>> origin/main
        console.log('Header loaded successfully');
    } catch (error) {
        console.error('Failed to load header:', error);
    }
}

<<<<<<< HEAD
// Function to update the user role display in header
function updateHeaderUserRole() {
    try {
        // Get current user from session (check both keys)
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.id) {
            currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        }

        if (currentUser.role) {
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) {
                // Capitalize first letter of each word and remove hyphens
                const roleDisplay = currentUser.role.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                userNameElement.textContent = roleDisplay;
            }
        }
    } catch (error) {
        console.error('Error updating header user role:', error);
    }
}

// Export the update function so it can be called from settings.js
export { updateHeaderUserRole };

=======
>>>>>>> origin/main
