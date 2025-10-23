// Dashboard Announcements Module

// Function to load recent announcements on the dashboard
export async function loadDashboardAnnouncements() {
    console.log('Loading dashboard announcements...');
    
    const announcementsList = document.getElementById('dashboard-announcements-list');
    if (!announcementsList) {
        console.error('Dashboard announcements list element not found');
        return;
    }
    
    try {
        // Show loading state
        announcementsList.innerHTML = `
            <div class="dashboard-announcement-loading">
                <div class="loading-spinner small"></div>
                <p>Loading announcements...</p>
            </div>
        `;
        
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.getAllAnnouncements !== 'function') {
            console.warn('Electron API not available for dashboard announcements. Using mock data.');
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
                    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    updated_at: new Date(Date.now() - 86400000).toISOString(),
                    created_by_username: 'Admin'
                },
                {
                    id: 3,
                    title: 'New Feature: Announcements',
                    content: 'We have added a new Announcements feature to keep everyone informed about important updates.',
                    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    updated_at: new Date(Date.now() - 172800000).toISOString(),
                    created_by_username: 'Admin'
                }
            ];
            
            renderDashboardAnnouncements(mockData.slice(0, 1)); // Show only the most recent announcement
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.getAllAnnouncements(1, 0); // Get only the most recent announcement
        
        if (result.success && result.data) {
            renderDashboardAnnouncements(result.data);
        } else {
            throw new Error('Failed to load announcements');
        }
    } catch (error) {
        console.error('Error loading dashboard announcements:', error);
        announcementsList.innerHTML = `
            <div class="dashboard-announcement-loading">
                <i class='bx bx-error-circle' style="font-size: 1.5rem; color: var(--danger-color); margin-bottom: 0.5rem;"></i>
                <p>Failed to load announcements</p>
            </div>
        `;
    }
}

// Render announcements in the dashboard
function renderDashboardAnnouncements(announcements) {
    const announcementsList = document.getElementById('dashboard-announcements-list');
    if (!announcementsList) return;
    
    if (announcements.length === 0) {
        announcementsList.innerHTML = `
            <div class="dashboard-announcement-loading">
                <i class='bx bx-message-square-detail' style="font-size: 1.5rem; color: var(--text-dark-tertiary); margin-bottom: 0.5rem;"></i>
                <p>No announcements yet</p>
            </div>
        `;
        return;
    }
    
    announcementsList.innerHTML = '';
    
    // Just take the first announcement (most recent)
    const announcement = announcements[0];
    const createdDate = new Date(announcement.created_at);
    const formattedDate = createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    const item = document.createElement('div');
    item.className = 'dashboard-announcement-item';
    item.dataset.id = announcement.id;
    
    item.innerHTML = `
        <div class="dashboard-announcement-title">${escapeHtml(announcement.title)}</div>
        <div class="dashboard-announcement-content">${escapeHtml(announcement.content)}</div>
        <div class="dashboard-announcement-date">${formattedDate}</div>
    `;
    
    // Add click event to navigate to announcements page
    item.addEventListener('click', () => {
        // Use the same navigation function as the View All button
        navigateToAnnouncementsPage();
    });
    
    announcementsList.appendChild(item);
    
    // Add click event to "View All" button
    const viewAllBtn = document.getElementById('btn-view-all-announcements');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            // Navigate to announcements page
            navigateToAnnouncementsPage();
        });
    }
}

// Function to navigate to announcements page and select sidebar item
function navigateToAnnouncementsPage() {
    console.log('Navigating to announcements page...');
    
    try {
        // Find the announcements nav item directly and click it
        // This will both navigate and select the sidebar item
        const announcementsLink = document.getElementById('nav-announcements');
        if (announcementsLink) {
            console.log('Found announcements link, clicking it...');
            announcementsLink.click();
            return;
        }
        
        // Fallback to standard navigation if the link wasn't found
        if (typeof navigateToView === 'function') {
            console.log('Using navigateToView function...');
            navigateToView('announcements');
        } else if (window.electronAPI && typeof window.electronAPI.navigateTo === 'function') {
            console.log('Using Electron IPC navigation...');
            window.electronAPI.navigateTo('announcements');
        } else {
            console.warn('No navigation method available');
        }
    } catch (error) {
        console.error('Error navigating to announcements:', error);
        
        // Last resort fallback
        try {
            window.location.hash = '#announcements';
        } catch (e) {
            console.error('Failed to set location hash:', e);
        }
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when the module is loaded
export function initializeDashboardAnnouncements() {
    // Set up event listeners if needed
    const viewAllBtn = document.getElementById('btn-view-all-announcements');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            if (window.electronAPI && typeof window.electronAPI.navigateTo === 'function') {
                window.electronAPI.navigateTo('announcements');
            } else {
                // Fallback if API not available
                console.log('Navigate to announcements page');
                if (typeof navigateToView === 'function') {
                    navigateToView('announcements');
                }
            }
        });
    }
    
    // Load announcements
    loadDashboardAnnouncements();
}
