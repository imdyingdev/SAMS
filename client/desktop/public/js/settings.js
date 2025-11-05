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

    // LRN prefix save button handler
    const saveLrnPrefixButton = document.getElementById('btn-save-lrn-prefix');
    if (saveLrnPrefixButton) {
        saveLrnPrefixButton.addEventListener('click', saveLrnPrefix);
    }

    // Role help icon tooltip handler
    const roleHelpIcon = document.getElementById('role-help-icon');
    const roleTooltip = document.getElementById('role-tooltip');

    console.log('Setting up role tooltip...', { roleHelpIcon, roleTooltip });

    if (roleHelpIcon && roleTooltip) {
        console.log('Both elements found, adding click listener');

        // Simple display-based toggle
        roleHelpIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Role help icon clicked, toggling tooltip');

            // Simple display toggle
            const isVisible = roleTooltip.style.display !== 'none';

            if (isVisible) {
                roleTooltip.style.display = 'none';
                console.log('Hiding tooltip');
            } else {
                roleTooltip.style.display = 'block';
                console.log('Showing tooltip');
            }

            // Hide tooltip when clicking elsewhere
            const hideTooltip = function(event) {
                if (!roleHelpIcon.contains(event.target) && !roleTooltip.contains(event.target)) {
                    roleTooltip.style.display = 'none';
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
        console.error('Role tooltip elements not found:', { roleHelpIcon, roleTooltip });
    }

    // LRN help icon tooltip handler
    const lrnHelpIcon = document.getElementById('lrn-help-icon');
    const lrnTooltip = document.getElementById('lrn-tooltip');

    console.log('Setting up LRN tooltip...', { lrnHelpIcon, lrnTooltip });

    if (lrnHelpIcon && lrnTooltip) {
        console.log('Both LRN elements found, adding click listener');

        // Simple display-based toggle
        lrnHelpIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('LRN help icon clicked, toggling tooltip');

            // Simple display toggle
            const isVisible = lrnTooltip.style.display !== 'none';

            if (isVisible) {
                lrnTooltip.style.display = 'none';
                console.log('Hiding LRN tooltip');
            } else {
                lrnTooltip.style.display = 'block';
                console.log('Showing LRN tooltip');
            }

            // Hide tooltip when clicking elsewhere
            const hideLrnTooltip = function(event) {
                if (!lrnHelpIcon.contains(event.target) && !lrnTooltip.contains(event.target)) {
                    lrnTooltip.style.display = 'none';
                    document.removeEventListener('click', hideLrnTooltip);
                    console.log('Hiding LRN tooltip from outside click');
                }
            };

            if (!isVisible) {
                setTimeout(() => {
                    document.addEventListener('click', hideLrnTooltip);
                }, 10);
            }
        });
    } else {
        console.error('LRN tooltip elements not found:', { lrnHelpIcon, lrnTooltip });
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

        // Load LRN prefix from localStorage
        const lrnPrefix = localStorage.getItem('lrnPrefix') || '109481';
        const lrnPrefixInput = document.getElementById('lrn-prefix');
        if (lrnPrefixInput) {
            lrnPrefixInput.value = lrnPrefix;
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

        // Show confirmation modal for role change
        showRoleChangeConfirmationModal(newRole, async () => {
            try {
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
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        showNotification('An error occurred while updating the role.', 'error');
        // Revert the dropdown to previous value
        loadCurrentSettings();
    }
}

// Show role change confirmation modal
function showRoleChangeConfirmationModal(newRole, onConfirm) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'announcement-modal';
    modal.id = 'role-change-modal';
    modal.style.display = 'flex';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content modal-small';

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const title = document.createElement('h2');
    title.textContent = 'Confirm Role Change';
    modalHeader.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.id = 'role-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => document.body.removeChild(modal));
    modalHeader.appendChild(closeButton);

    modalContent.appendChild(modalHeader);

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const roleDisplay = newRole === 'super-administrator' ? 'Super Administrator' : 'Administrator';

    const message = document.createElement('p');
    message.innerHTML = `Are you sure you want to switch to <strong>${roleDisplay}</strong> mode?`;
    modalBody.appendChild(message);

    const warning = document.createElement('p');
    if (newRole === 'super-administrator') {
        warning.innerHTML = '<strong>⚠️ Warning:</strong> Super Administrator mode removes all confirmation dialogs for enhanced efficiency, but increases risk of accidental actions.';
        warning.style.cssText = 'color: #ef4444; font-size: 0.9rem; margin-top: 1rem;';
    } else {
        warning.innerHTML = '<strong>✅ Safe Mode:</strong> Administrator mode keeps all confirmation dialogs for data safety.';
        warning.style.cssText = 'color: #10B981; font-size: 0.9rem; margin-top: 1rem;';
    }
    modalBody.appendChild(warning);

    // Modal actions
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn-cancel';
    cancelButton.id = 'btn-cancel-role-change';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => document.body.removeChild(modal));

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = newRole === 'super-administrator' ? 'btn-delete' : 'btn-submit';
    confirmButton.id = 'btn-confirm-role-change';
    confirmButton.textContent = 'Switch Role';
    confirmButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        onConfirm();
    });

    modalActions.appendChild(cancelButton);
    modalActions.appendChild(confirmButton);
    modalBody.appendChild(modalActions);

    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

async function saveLrnPrefix() {
    try {
        const lrnPrefixInput = document.getElementById('lrn-prefix');
        const newPrefix = lrnPrefixInput.value.trim();

        if (!newPrefix) {
            showNotification('Please enter an LRN prefix.', 'error');
            return;
        }

        // Save to localStorage
        localStorage.setItem('lrnPrefix', newPrefix);
        
        showNotification('LRN prefix saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving LRN prefix:', error);
        showNotification('An error occurred while saving the LRN prefix.', 'error');
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