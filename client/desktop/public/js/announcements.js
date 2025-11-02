// Announcements page functionality as ES6 module
import { initializeLogout } from './logout.js';

let currentEditingId = null;
let currentDeletingId = null;

export function initializeAnnouncementsPage() {
    console.log('Announcements page script initialized');
    
    // Initialize logout functionality
    initializeLogout();
    
    // Initialize visibility state
    initializeAnnouncementsVisibility();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check if Electron API is available
    if (window.electronAPI) {
        console.log('✅ Electron API available');
    } else {
        console.warn('⚠️ Electron API not available');
    }
}

// Initialize announcements visibility state
function initializeAnnouncementsVisibility() {
    const announcementsList = document.getElementById('announcements-list');
    const statusIndicator = document.getElementById('announcements-status-indicator');
    
    // Show loading state initially
    showAnnouncementsStatus('loading', 'Loading announcements...', 'Please wait while we fetch the announcements.');
    
    if (announcementsList) {
        announcementsList.style.display = 'none';
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Create announcement button
    const btnCreate = document.getElementById('btn-create-announcement');
    if (btnCreate) {
        btnCreate.addEventListener('click', openCreateModal);
    }
    
    // Modal close buttons
    const modalClose = document.getElementById('modal-close');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);
    
    // Delete modal buttons
    const deleteModalClose = document.getElementById('delete-modal-close');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteModal);
    if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);
    if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', confirmDelete);
    
    // Form submission
    const announcementForm = document.getElementById('announcement-form');
    if (announcementForm) {
        announcementForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Search functionality
    const searchInput = document.getElementById('announcement-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
<<<<<<< HEAD
    // Character counter for content
    const contentTextarea = document.getElementById('announcement-content');
    const characterCount = document.getElementById('content-character-count');
    if (contentTextarea && characterCount) {
        contentTextarea.addEventListener('input', () => {
            const currentLength = contentTextarea.value.length;
            characterCount.textContent = `${currentLength} / 500`;
            
            // Visual feedback for minimum requirement
            if (currentLength < 150) {
                characterCount.style.color = '#ef4444'; // Red
            } else {
                characterCount.style.color = 'rgba(255, 255, 255, 0.6)'; // Normal
            }
        });
    }
    
=======
>>>>>>> origin/main
    // Close modals on background click
    const announcementModal = document.getElementById('announcement-modal');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    if (announcementModal) {
        announcementModal.addEventListener('click', (e) => {
            if (e.target === announcementModal) closeModal();
        });
    }
    
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }
}

// Load announcements
export async function loadAnnouncements() {
    console.log('Loading announcements...');
    
    const announcementsList = document.getElementById('announcements-list');
    const statusIndicator = document.getElementById('announcements-status-indicator');
    
    if (!announcementsList || !statusIndicator) {
        console.error('Required elements not found');
        return;
    }
    
    try {
        showAnnouncementsStatus('loading', 'Loading announcements...', 'Please wait while we fetch the announcements.');
        
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.getAllAnnouncements !== 'function') {
            console.warn('Electron API not available or getAllAnnouncements is not a function. Using mock data.');
            // Use mock data for testing
            const mockData = [
                {
                    id: 1,
                    title: 'Welcome to SAMS',
                    content: 'Welcome to the Student Attendance Management System. This system helps track student attendance efficiently.',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by_username: 'Admin'
                },
                {
                    id: 2,
                    title: 'System Maintenance',
                    content: 'The system will be down for maintenance on Saturday from 10 PM to 2 AM.',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by_username: 'Admin'
                },
                {
                    id: 3,
                    title: 'New Feature: Announcements',
                    content: 'We have added a new Announcements feature to keep everyone informed about important updates.',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by_username: 'Admin'
                }
            ];
            
            if (mockData.length === 0) {
                showEmptyState();
            } else {
                renderAnnouncements(mockData);
                
                // Hide status indicator and show list
                statusIndicator.style.display = 'none';
                announcementsList.style.display = 'flex';
            }
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.getAllAnnouncements(100, 0);
        
        if (result.success && result.data) {
            console.log(`Loaded ${result.data.length} announcements`);
            
            if (result.data.length === 0) {
                showEmptyState();
            } else {
                renderAnnouncements(result.data);
                
                // Hide status indicator and show list
                statusIndicator.style.display = 'none';
                announcementsList.style.display = 'flex';
            }
        } else {
            throw new Error('Failed to load announcements');
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        showAnnouncementsStatus('error', 'Error Loading Announcements', error.message || 'Failed to fetch announcements. Please try again.');
    }
}

<<<<<<< HEAD
// Render announcements in bento box column layout
=======
// Render announcements
>>>>>>> origin/main
function renderAnnouncements(announcements) {
    const announcementsList = document.getElementById('announcements-list');
    
    if (!announcementsList) return;
    
    announcementsList.innerHTML = '';
    
<<<<<<< HEAD
    // Determine number of columns based on screen width
    const screenWidth = window.innerWidth;
    let numColumns = 2; // default
    if (screenWidth >= 1400) {
        numColumns = 3; // full screen
    } else if (screenWidth <= 768) {
        numColumns = 1; // mobile
    }
    
    // Create columns
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.className = 'announcement-column';
        columns.push(column);
        announcementsList.appendChild(column);
    }
    
    // Distribute cards round-robin across columns
    announcements.forEach((announcement, index) => {
        const columnIndex = index % numColumns;
        const card = createAnnouncementCard(announcement);
        columns[columnIndex].appendChild(card);
=======
    announcements.forEach(announcement => {
        const card = createAnnouncementCard(announcement);
        announcementsList.appendChild(card);
>>>>>>> origin/main
    });
}

// Create announcement card
function createAnnouncementCard(announcement) {
    const card = document.createElement('div');
    card.className = 'announcement-card';
    card.dataset.id = announcement.id;
    
    const createdDate = new Date(announcement.created_at);
    const formattedDate = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="announcement-card-header">
            <h3 class="announcement-title">${escapeHtml(announcement.title)}</h3>
            <div class="announcement-actions">
                <button class="action-btn edit-btn" data-id="${announcement.id}" title="Edit">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="action-btn delete-btn" data-id="${announcement.id}" title="Delete">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        </div>
        <div class="announcement-content">${escapeHtml(announcement.content)}</div>
        <div class="announcement-footer">
            <div class="announcement-author">
                <i class='bx bx-user'></i>
                <span>${announcement.created_by_username || 'Admin'}</span>
            </div>
            <div class="announcement-date">
                <i class='bx bx-calendar'></i>
                <span>${formattedDate}</span>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => openEditModal(announcement.id));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => openDeleteModal(announcement.id));
    }
    
    return card;
}

// Show empty state
function showEmptyState() {
    const announcementsList = document.getElementById('announcements-list');
    const statusIndicator = document.getElementById('announcements-status-indicator');
    
    if (!announcementsList) return;
    
    announcementsList.innerHTML = `
        <div class="empty-state">
            <i class='bx bx-bullhorn'></i>
            <h3>No Announcements Yet</h3>
            <p>Click the "New Announcement" button to create your first announcement.</p>
        </div>
    `;
    
    statusIndicator.style.display = 'none';
    announcementsList.style.display = 'flex';
}

// Show status indicator
function showAnnouncementsStatus(type, title, message) {
    const statusIndicator = document.getElementById('announcements-status-indicator');
    const spinner = document.getElementById('announcement-status-spinner');
    const searchIcon = document.getElementById('announcement-status-search-icon');
    const errorIcon = document.getElementById('announcement-status-error-icon');
    const statusTitle = document.getElementById('announcement-status-title');
    const statusMessage = document.getElementById('announcement-status-message');
    const announcementsList = document.getElementById('announcements-list');
    
    if (!statusIndicator) return;
    
    // Reset all icons
    if (spinner) spinner.style.display = 'none';
    if (searchIcon) searchIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    // Show appropriate icon
    if (type === 'loading' && spinner) {
        spinner.style.display = 'block';
    } else if (type === 'empty' && searchIcon) {
        searchIcon.style.display = 'block';
    } else if (type === 'error' && errorIcon) {
        errorIcon.style.display = 'block';
    }
    
    // Update text
    if (statusTitle) statusTitle.textContent = title;
    if (statusMessage) statusMessage.textContent = message;
    
    // Show indicator, hide list
    statusIndicator.style.display = 'flex';
    if (announcementsList) announcementsList.style.display = 'none';
}

// Open create modal
function openCreateModal() {
    const modal = document.getElementById('announcement-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    const form = document.getElementById('announcement-form');
<<<<<<< HEAD
    const characterCount = document.getElementById('content-character-count');
=======
>>>>>>> origin/main
    
    if (!modal) return;
    
    // Reset form
    if (form) form.reset();
    
<<<<<<< HEAD
    // Reset character count
    if (characterCount) {
        characterCount.textContent = '0 / 500';
        characterCount.style.color = '#ef4444'; // Red for below minimum
    }
    
=======
>>>>>>> origin/main
    // Set to create mode
    currentEditingId = null;
    document.getElementById('announcement-id').value = '';
    
    if (modalTitle) modalTitle.textContent = 'Create Announcement';
    if (submitText) submitText.textContent = 'Create';
    
    modal.style.display = 'flex';
}

// Open edit modal
async function openEditModal(id) {
    const modal = document.getElementById('announcement-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    
    if (!modal) return;
    
    try {
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.getAnnouncementById !== 'function') {
            console.warn('Electron API not available or getAnnouncementById is not a function. Using mock data.');
            // Find the announcement in the DOM
            const cards = document.querySelectorAll('.announcement-card');
            let announcement = null;
            
            for (const card of cards) {
                if (card.dataset.id == id) {
                    announcement = {
                        id: id,
                        title: card.querySelector('.announcement-title').textContent,
                        content: card.querySelector('.announcement-content').textContent
                    };
                    break;
                }
            }
            
            if (announcement) {
                // Set form values
                document.getElementById('announcement-id').value = announcement.id;
                document.getElementById('announcement-title').value = announcement.title;
                document.getElementById('announcement-content').value = announcement.content;
                
<<<<<<< HEAD
                // Update character count
                const characterCount = document.getElementById('content-character-count');
                if (characterCount) {
                    const length = announcement.content.length;
                    characterCount.textContent = `${length} / 500`;
                    characterCount.style.color = length < 150 ? '#ef4444' : 'rgba(255, 255, 255, 0.6)';
                }
                
=======
>>>>>>> origin/main
                // Set to edit mode
                currentEditingId = id;
                
                if (modalTitle) modalTitle.textContent = 'Edit Announcement';
                if (submitText) submitText.textContent = 'Update';
                
                modal.style.display = 'flex';
            } else {
                throw new Error('Announcement not found');
            }
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.getAnnouncementById(id);
        
        if (result.success && result.data) {
            const announcement = result.data;
            
            // Set form values
            document.getElementById('announcement-id').value = announcement.id;
            document.getElementById('announcement-title').value = announcement.title;
            document.getElementById('announcement-content').value = announcement.content;
<<<<<<< HEAD

            // Update character count
            const characterCount = document.getElementById('content-character-count');
            if (characterCount) {
                const length = announcement.content.length;
                characterCount.textContent = `${length} / 500`;
                characterCount.style.color = length < 150 ? '#ef4444' : 'rgba(255, 255, 255, 0.6)';
            }

            // Set to edit mode
            currentEditingId = id;

=======
            
            // Set to edit mode
            currentEditingId = id;
            
>>>>>>> origin/main
            if (modalTitle) modalTitle.textContent = 'Edit Announcement';
            if (submitText) submitText.textContent = 'Update';
            
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error loading announcement for edit:', error);
        alert('Failed to load announcement details.');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('announcement-modal');
    const form = document.getElementById('announcement-form');
    
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    
    currentEditingId = null;
}

// Open delete modal
function openDeleteModal(id) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    if (!deleteModal) return;
    
    currentDeletingId = id;
    deleteModal.style.display = 'flex';
}

// Close delete modal
function closeDeleteModal() {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    if (deleteModal) deleteModal.style.display = 'none';
    
    currentDeletingId = null;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('announcement-title').value.trim();
    const content = document.getElementById('announcement-content').value.trim();
    const submitBtn = document.getElementById('btn-submit-announcement');
    const submitText = document.getElementById('submit-text');
    
    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }
    
    const announcementData = { title, content };
    
    try {
        // Disable submit button
        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.textContent = currentEditingId ? 'Updating...' : 'Creating...';
        
        // Check if electronAPI is available
        if (!window.electronAPI || 
            (currentEditingId && typeof window.electronAPI.updateAnnouncement !== 'function') ||
            (!currentEditingId && typeof window.electronAPI.createAnnouncement !== 'function')) {
            
            console.warn('Electron API not available. Using mock implementation.');
            
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (currentEditingId) {
                // Update existing announcement in DOM
                const card = document.querySelector(`.announcement-card[data-id="${currentEditingId}"]`);
                if (card) {
                    card.querySelector('.announcement-title').textContent = title;
                    card.querySelector('.announcement-content').textContent = content;
                }
            } else {
                // Create a new announcement in DOM
                const mockId = Date.now();
                const mockAnnouncement = {
                    id: mockId,
                    title: title,
                    content: content,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by_username: 'Admin'
                };
                
                const announcementsList = document.getElementById('announcements-list');
                if (announcementsList) {
<<<<<<< HEAD
                    // Add to first column
                    const firstColumn = announcementsList.querySelector('.announcement-column');
                    if (firstColumn) {
                        const card = createAnnouncementCard(mockAnnouncement);
                        firstColumn.insertBefore(card, firstColumn.firstChild);
                    } else {
                        // If no columns exist, reload all announcements
                        loadAnnouncements();
                    }
=======
                    const card = createAnnouncementCard(mockAnnouncement);
                    announcementsList.insertBefore(card, announcementsList.firstChild);
>>>>>>> origin/main
                    
                    // Hide empty state if it was showing
                    const emptyState = announcementsList.querySelector('.empty-state');
                    if (emptyState) {
                        emptyState.remove();
                    }
                }
            }
            
            closeModal();
            return;
        }
        
        // Use actual API if available
        let result;
        
        if (currentEditingId) {
            // Update existing announcement
            result = await window.electronAPI.updateAnnouncement(currentEditingId, announcementData);
        } else {
            // Create new announcement
            result = await window.electronAPI.createAnnouncement(announcementData);
        }
        
        if (result.success) {
            console.log('Announcement saved successfully');
            closeModal();
            loadAnnouncements(); // Reload announcements
        } else {
            throw new Error('Failed to save announcement');
        }
    } catch (error) {
        console.error('Error saving announcement:', error);
        alert(error.message || 'Failed to save announcement. Please try again.');
    } finally {
        // Re-enable submit button
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = currentEditingId ? 'Update' : 'Create';
    }
}

// Confirm delete
async function confirmDelete() {
    if (!currentDeletingId) return;
    
    const btnConfirm = document.getElementById('btn-confirm-delete');
    
    try {
        // Disable button
        if (btnConfirm) {
            btnConfirm.disabled = true;
            btnConfirm.textContent = 'Deleting...';
        }
        
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.deleteAnnouncement !== 'function') {
            console.warn('Electron API not available. Using mock implementation.');
            
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Remove the announcement from DOM
            const card = document.querySelector(`.announcement-card[data-id="${currentDeletingId}"]`);
            if (card) {
                card.remove();
                
<<<<<<< HEAD
                // Check if there are any announcements left in all columns
                const announcementsList = document.getElementById('announcements-list');
                const allCards = announcementsList ? announcementsList.querySelectorAll('.announcement-card') : [];
                if (allCards.length === 0) {
=======
                // Check if there are any announcements left
                const announcementsList = document.getElementById('announcements-list');
                if (announcementsList && announcementsList.children.length === 0) {
>>>>>>> origin/main
                    showEmptyState();
                }
            }
            
            closeDeleteModal();
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.deleteAnnouncement(currentDeletingId);
        
        if (result.success) {
            console.log('Announcement deleted successfully');
            closeDeleteModal();
            loadAnnouncements(); // Reload announcements
        } else {
            throw new Error('Failed to delete announcement');
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert(error.message || 'Failed to delete announcement. Please try again.');
    } finally {
        // Re-enable button
        if (btnConfirm) {
            btnConfirm.disabled = false;
            btnConfirm.textContent = 'Delete';
        }
    }
}

// Handle search
let searchTimeout;
function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Debounce search
    searchTimeout = setTimeout(async () => {
        if (searchTerm === '') {
            loadAnnouncements();
        } else {
            await searchAnnouncements(searchTerm);
        }
    }, 300);
}

// Search announcements
async function searchAnnouncements(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    
    const announcementsList = document.getElementById('announcements-list');
    const statusIndicator = document.getElementById('announcements-status-indicator');
    
    try {
        showAnnouncementsStatus('loading', 'Searching...', 'Please wait while we search for announcements.');
        
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.searchAnnouncements !== 'function') {
            console.warn('Electron API not available. Using client-side search implementation.');
            
            // Get all announcement cards
            const cards = document.querySelectorAll('.announcement-card');
            const searchTermLower = searchTerm.toLowerCase();
            const matchingAnnouncements = [];
            
            // Client-side search
            cards.forEach(card => {
                const title = card.querySelector('.announcement-title').textContent.toLowerCase();
                const content = card.querySelector('.announcement-content').textContent.toLowerCase();
                
                if (title.includes(searchTermLower) || content.includes(searchTermLower)) {
                    // Show matching cards
                    card.style.display = 'block';
                    matchingAnnouncements.push(card);
                } else {
                    // Hide non-matching cards
                    card.style.display = 'none';
                }
            });
            
            if (matchingAnnouncements.length === 0) {
                showAnnouncementsStatus('empty', 'No Results Found', `No announcements found matching "${searchTerm}".`);
            } else {
                statusIndicator.style.display = 'none';
                announcementsList.style.display = 'flex';
            }
            
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.searchAnnouncements(searchTerm, 100, 0);
        
        if (result.success && result.data) {
            if (result.data.length === 0) {
                showAnnouncementsStatus('empty', 'No Results Found', `No announcements found matching "${searchTerm}".`);
            } else {
                renderAnnouncements(result.data);
                statusIndicator.style.display = 'none';
                announcementsList.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error searching announcements:', error);
        showAnnouncementsStatus('error', 'Search Error', 'Failed to search announcements. Please try again.');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export search functionality for external use
export function setupAnnouncementsSearch() {
    const searchInput = document.getElementById('announcement-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}
