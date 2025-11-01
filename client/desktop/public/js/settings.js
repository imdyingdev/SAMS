// Settings page functionality
export function initializeSettingsPage() {
    console.log('⚙️ Initializing settings page...');

    // Initialize settings functionality
    setupSettingsHandlers();

    // Load current settings
    loadCurrentSettings();

    console.log('✅ Settings page initialized');
}

// Function to update header when role changes
function updateHeaderRoleDisplay(newRole) {
    try {
        // Import the update function from header-loader
        import('./header-loader.js').then(module => {
            if (module.updateHeaderUserRole) {
                // Create a temporary user object with the new role
                const tempUser = { role: newRole };
                // Temporarily set localStorage to have this role for the header update
                const originalUser = localStorage.getItem('user');
                localStorage.setItem('user', JSON.stringify(tempUser));
                module.updateHeaderUserRole();
                // Restore original user data
                if (originalUser) {
                    localStorage.setItem('user', originalUser);
                } else {
                    localStorage.removeItem('user');
                }
            }
        }).catch(error => {
            console.error('Error updating header role display:', error);
        });
    } catch (error) {
        console.error('Error updating header role display:', error);
    }
}

function setupSettingsHandlers() {
    // User role dropdown change handler
    const userRoleSelect = document.getElementById('user-role-full');
    if (userRoleSelect) {
        userRoleSelect.addEventListener('change', updateUserRole);
    }
}

async function loadCurrentSettings() {
    try {
        // Get current user from session/localStorage (check both keys)
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.id) {
            currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        }

        if (!currentUser.id) {
            console.warn('No current user found');
            return;
        }

        // Load current role from database
        const response = await window.electronAPI.getUserRole(currentUser.id);

        if (response.success) {
            const userRoleSelect = document.getElementById('user-role-full');
            if (userRoleSelect) {
                userRoleSelect.value = response.role;
            }
        } else {
            console.error('Failed to load user role:', response.message);
        }
    } catch (error) {
        console.error('Error loading current settings:', error);
    }
}

async function updateUserRole() {
    try {
        const userRoleSelect = document.getElementById('user-role-full');
        const newRole = userRoleSelect.value;

        // Get current user from session (check both keys)
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.id) {
            currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        }

        if (!currentUser.id) {
            showNotification('No user session found. Please login again.', 'error');
            return;
        }

        // Update role in database
        const response = await window.electronAPI.updateUserRole(currentUser.id, newRole);

        if (response.success) {
            // Update localStorage/session
            currentUser.role = newRole;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('user', JSON.stringify(currentUser)); // Update both keys

            // Update header display
            updateHeaderRoleDisplay(newRole);

            showNotification('User role updated successfully!', 'success');
        } else {
            showNotification('Failed to update user role: ' + response.message, 'error');
            // Revert the dropdown to previous value
            loadCurrentSettings();
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        showNotification('An error occurred while updating the role.', 'error');
        // Revert the dropdown to previous value
        loadCurrentSettings();
    }
}


function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export for use in other modules
window.initializeSettingsPage = initializeSettingsPage;