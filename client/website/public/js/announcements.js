document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch announcements from API
    async function fetchAnnouncements() {
        try {
            // Show loading state
            const container = document.querySelector('.announcement-container');
            if (container) {
                container.innerHTML = `
                    <div class="announcements-status-indicator">
                        <div class="status-content">
                            <div class="status-icon">
                                <div class="loading-spinner" id="announcement-status-spinner"></div>
                            </div>
                            <div class="status-text">
                                <h3>Loading announcements...</h3>
                                <p>Please wait while we fetch the announcements.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Fetch the latest 3 announcements from the API (using flat structure)
            const response = await fetch('/api/announcements-latest');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const announcements = await response.json();
            renderAnnouncements(announcements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            showErrorState();
        }
    }

    // Function to show error state
    function showErrorState() {
        const container = document.querySelector('.announcement-container');
        if (container) {
            container.innerHTML = `
                <div class="announcements-status-indicator">
                    <div class="status-content">
                        <div class="status-icon">
                            <i class='bx bx-error-circle' id="announcement-status-error-icon"></i>
                        </div>
                        <div class="status-text">
                            <h3>Failed to load announcements</h3>
                            <p>Please try again later.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Function to render announcements
    function renderAnnouncements(announcements) {
        const container = document.querySelector('.announcement-container');
        if (!container) return;

        // Clear existing announcements
        container.innerHTML = '';
        
        if (announcements.length === 0) {
            container.innerHTML = `
                <div class="announcements-status-indicator">
                    <div class="status-content">
                        <div class="status-icon">
                            <i class='bx bx-message-square-detail'></i>
                        </div>
                        <div class="status-text">
                            <h3>No announcements yet</h3>
                            <p>Check back later for updates.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Create a wrapper with max-width for better layout
        const announcementsWrapper = document.createElement('div');
        announcementsWrapper.style.maxWidth = '1200px';
        announcementsWrapper.style.margin = '0 auto';
        announcementsWrapper.style.width = '100%';
        container.appendChild(announcementsWrapper);
        
        // Create announcements list container
        const announcementsListContainer = document.createElement('div');
        announcementsListContainer.className = 'announcements-list';
        announcementsWrapper.appendChild(announcementsListContainer);

        // Render each announcement
        announcements.forEach(announcement => {
            const card = createAnnouncementCard(announcement);
            announcementsListContainer.appendChild(card);
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
        
        return card;
    }

    // Utility function to escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize by fetching announcements
    fetchAnnouncements();
});
