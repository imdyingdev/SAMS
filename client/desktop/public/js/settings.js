// Settings page functionality
export function initializeSettingsPage() {
    console.log('⚙️ Initializing settings page...');

    // Initialize settings functionality
    setupSettingsHandlers();

    // Load current settings
    loadCurrentSettings();

    // Load grade sections
    loadGradeSections();

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

// ==================== Grade Sections Management ====================

let gradeSectionsData = { grades: [], sections: {} };

// Load and display grade sections
async function loadGradeSections() {
    const container = document.getElementById('grade-sections-container');
    if (!container) return;

    // Show loading
    container.innerHTML = `
        <div class="grade-sections-loading">
            <div class="loading-spinner small"></div>
            <p>Loading sections...</p>
        </div>
    `;

    try {
        const result = await window.electronAPI.getAllGradeSections();
        
        if (result.success) {
            gradeSectionsData = result;
            renderGradeSections();
        } else {
            container.innerHTML = `<p class="no-sections">Failed to load sections: ${result.message}</p>`;
        }
    } catch (error) {
        console.error('Error loading grade sections:', error);
        container.innerHTML = `<p class="no-sections">Error loading sections</p>`;
    }

    // Setup add grade button
    const addGradeBtn = document.getElementById('btn-add-grade-level');
    if (addGradeBtn) {
        addGradeBtn.addEventListener('click', showAddGradeModal);
    }
}

// Render grade sections UI
function renderGradeSections() {
    const container = document.getElementById('grade-sections-container');
    if (!container) return;

    const { grades, sections } = gradeSectionsData;

    if (grades.length === 0) {
        container.innerHTML = `<p class="no-sections">No grade sections found. Click "Add Grade" to create one.</p>`;
        return;
    }

    container.innerHTML = grades.map(grade => {
        const gradeSections = sections[grade] || [];
        const totalStudents = gradeSections.reduce((sum, s) => sum + s.studentCount, 0);
        
        return `
            <div class="grade-group" data-grade="${grade}">
                <div class="grade-header" onclick="toggleGradeCollapse('${grade}')">
                    <div class="grade-title">
                        <i class='bx bx-chevron-down collapsed' id="chevron-${grade}"></i>
                        <span>Grade ${grade}</span>
                        <span class="grade-count">(${gradeSections.length} sections, ${totalStudents} students)</span>
                    </div>
                    <button class="btn-add-section" onclick="event.stopPropagation(); showAddSectionPrompt('${grade}')">
                        <i class='bx bx-plus'></i> Add Section
                    </button>
                </div>
                <div class="sections-list collapsed" id="sections-list-${grade}">
                    ${gradeSections.length > 0 ? gradeSections.map(section => `
                        <div class="section-item" data-section-id="${section.id}">
                            <div class="section-info">
                                <span class="section-name" id="name-${section.id}">${section.sectionName}</span>
                                <input type="text" class="section-name-input" id="input-${section.id}" value="${section.sectionName}">
                                <span class="student-count">${section.studentCount} students</span>
                            </div>
                            <div class="section-actions">
                                <button class="btn-edit-section" id="edit-${section.id}" onclick="startEditSection(${section.id})" title="Edit">
                                    <i class='bx bx-edit-alt'></i>
                                </button>
                                <button class="btn-save-section" id="save-${section.id}" onclick="saveSection(${section.id})" title="Save">
                                    <i class='bx bx-check'></i>
                                </button>
                                <button class="btn-cancel-section" id="cancel-${section.id}" onclick="cancelEditSection(${section.id})" title="Cancel">
                                    <i class='bx bx-x'></i>
                                </button>
                                <button class="btn-delete-section" id="delete-${section.id}" onclick="confirmDeleteSection(${section.id}, '${section.sectionName}', ${section.studentCount})" title="Delete">
                                    <i class='bx bx-trash'></i>
                                </button>
                            </div>
                        </div>
                    `).join('') : '<p class="no-sections">No sections in this grade</p>'}
                </div>
            </div>
        `;
    }).join('');
}

// Toggle grade collapse (accordion behavior - only one open at a time)
window.toggleGradeCollapse = function(grade) {
    const sectionsList = document.getElementById(`sections-list-${grade}`);
    const chevron = document.getElementById(`chevron-${grade}`);
    
    if (!sectionsList || !chevron) return;
    
    const isCurrentlyCollapsed = sectionsList.classList.contains('collapsed');
    
    // If opening this grade, close all others first
    if (isCurrentlyCollapsed) {
        // Close all other grades
        const allGrades = gradeSectionsData.grades || [];
        allGrades.forEach(g => {
            if (g !== grade) {
                const otherSectionsList = document.getElementById(`sections-list-${g}`);
                const otherChevron = document.getElementById(`chevron-${g}`);
                if (otherSectionsList && !otherSectionsList.classList.contains('collapsed')) {
                    otherSectionsList.classList.add('collapsed');
                    otherChevron?.classList.add('collapsed');
                }
            }
        });
    }
    
    // Toggle the clicked grade
    sectionsList.classList.toggle('collapsed');
    chevron.classList.toggle('collapsed');
};

// Start editing a section
window.startEditSection = function(sectionId) {
    const nameSpan = document.getElementById(`name-${sectionId}`);
    const nameInput = document.getElementById(`input-${sectionId}`);
    const editBtn = document.getElementById(`edit-${sectionId}`);
    const saveBtn = document.getElementById(`save-${sectionId}`);
    const cancelBtn = document.getElementById(`cancel-${sectionId}`);
    const deleteBtn = document.getElementById(`delete-${sectionId}`);

    nameSpan.classList.add('editing');
    nameInput.classList.add('editing');
    editBtn.classList.add('editing');
    deleteBtn.classList.add('editing');
    saveBtn.classList.add('editing');
    cancelBtn.classList.add('editing');
    
    nameInput.focus();
    nameInput.select();
};

// Cancel editing a section
window.cancelEditSection = function(sectionId) {
    const nameSpan = document.getElementById(`name-${sectionId}`);
    const nameInput = document.getElementById(`input-${sectionId}`);
    const editBtn = document.getElementById(`edit-${sectionId}`);
    const saveBtn = document.getElementById(`save-${sectionId}`);
    const cancelBtn = document.getElementById(`cancel-${sectionId}`);
    const deleteBtn = document.getElementById(`delete-${sectionId}`);

    // Reset input to original value
    nameInput.value = nameSpan.textContent;

    nameSpan.classList.remove('editing');
    nameInput.classList.remove('editing');
    editBtn.classList.remove('editing');
    deleteBtn.classList.remove('editing');
    saveBtn.classList.remove('editing');
    cancelBtn.classList.remove('editing');
};

// Save section changes
window.saveSection = async function(sectionId) {
    const nameInput = document.getElementById(`input-${sectionId}`);
    const newName = nameInput.value.trim();

    if (!newName) {
        showNotification('Section name cannot be empty', 'error');
        return;
    }

    try {
        const result = await window.electronAPI.updateSection(sectionId, newName);
        
        if (result.success) {
            showNotification('Section updated successfully', 'success');
            loadGradeSections(); // Reload to get fresh data
        } else {
            showNotification(result.message || 'Failed to update section', 'error');
        }
    } catch (error) {
        console.error('Error updating section:', error);
        showNotification('Error updating section', 'error');
    }
};

// Confirm delete section
window.confirmDeleteSection = function(sectionId, sectionName, studentCount) {
    if (studentCount > 0) {
        showNotification(`Cannot delete "${sectionName}": ${studentCount} students are assigned to this section`, 'error');
        return;
    }

    // Create confirmation modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        min-width: 350px;
        animation: slideUp 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #333;">Delete Section</h3>
        <p style="color: #666; margin-bottom: 20px;">Are you sure you want to delete "<strong>${sectionName}</strong>"?</p>
        <div class="modal-buttons">
            <button class="btn-cancel" onclick="this.closest('div[style*=position]').remove()">Cancel</button>
            <button class="btn-save" style="background: #ef4444;" id="confirm-delete-btn">Delete</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Handle delete confirmation
    modalContent.querySelector('#confirm-delete-btn').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.deleteSection(sectionId);
            
            if (result.success) {
                showNotification('Section deleted successfully', 'success');
                loadGradeSections();
            } else {
                showNotification(result.message || 'Failed to delete section', 'error');
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            showNotification('Error deleting section', 'error');
        }
        modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
};

// Show add section prompt
window.showAddSectionPrompt = function(gradeLevel) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'add-grade-modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #333;">Add Section to Grade ${gradeLevel}</h3>
        <div class="form-group">
            <label>Section Name</label>
            <input type="text" id="new-section-name" placeholder="e.g., Rose, Sampaguita">
        </div>
        <div class="modal-buttons">
            <button class="btn-cancel" onclick="this.closest('div[style*=position]').remove()">Cancel</button>
            <button class="btn-save" id="confirm-add-section-btn">Add Section</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Focus input
    setTimeout(() => {
        modalContent.querySelector('#new-section-name').focus();
    }, 100);

    // Handle add section
    modalContent.querySelector('#confirm-add-section-btn').addEventListener('click', async () => {
        const sectionName = modalContent.querySelector('#new-section-name').value.trim();
        
        if (!sectionName) {
            showNotification('Please enter a section name', 'error');
            return;
        }

        try {
            const result = await window.electronAPI.addSection(gradeLevel, sectionName);
            
            if (result.success) {
                showNotification(`Section "${sectionName}" added successfully`, 'success');
                loadGradeSections();
                modal.remove();
            } else {
                showNotification(result.message || 'Failed to add section', 'error');
            }
        } catch (error) {
            console.error('Error adding section:', error);
            showNotification('Error adding section', 'error');
        }
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Enter key to submit
    modalContent.querySelector('#new-section-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            modalContent.querySelector('#confirm-add-section-btn').click();
        }
    });
};

// Show add grade modal
function showAddGradeModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'add-grade-modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #333;">Add New Grade Level</h3>
        <div class="form-group">
            <label>Grade Level</label>
            <select id="new-grade-level">
                <option value="">Select Grade Level</option>
                <option value="K">Kindergarten (K)</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
            </select>
        </div>
        <div class="form-group">
            <label>First Section Name</label>
            <input type="text" id="initial-section-name" placeholder="e.g., Rose, Sampaguita">
        </div>
        <div class="modal-buttons">
            <button class="btn-cancel" onclick="this.closest('div[style*=position]').remove()">Cancel</button>
            <button class="btn-save" id="confirm-add-grade-btn">Add Grade</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Handle add grade
    modalContent.querySelector('#confirm-add-grade-btn').addEventListener('click', async () => {
        const gradeLevel = modalContent.querySelector('#new-grade-level').value;
        const sectionName = modalContent.querySelector('#initial-section-name').value.trim();
        
        if (!gradeLevel) {
            showNotification('Please select a grade level', 'error');
            return;
        }
        
        if (!sectionName) {
            showNotification('Please enter a section name', 'error');
            return;
        }

        try {
            const result = await window.electronAPI.addGradeLevel(gradeLevel, sectionName);
            
            if (result.success) {
                showNotification(`Grade ${gradeLevel} added successfully`, 'success');
                loadGradeSections();
                modal.remove();
            } else {
                showNotification(result.message || 'Failed to add grade level', 'error');
            }
        } catch (error) {
            console.error('Error adding grade level:', error);
            showNotification('Error adding grade level', 'error');
        }
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
};

// Add animation keyframes if not already added
if (!document.getElementById('modal-animations')) {
    const style = document.createElement('style');
    style.id = 'modal-animations';
    style.textContent = `
        @keyframes slideUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
window.initializeSettingsPage = initializeSettingsPage;