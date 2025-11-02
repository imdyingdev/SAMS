document.addEventListener('DOMContentLoaded', function() {
    // Create modal element
    const modal = createModal();
    document.body.appendChild(modal);
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
            
            // Check if content overflows and remove fade effect if not
            const content = card.querySelector('.announcement-content');
            if (content.scrollHeight <= content.clientHeight) {
                card.classList.add('no-overflow');
            }
            
            // Add click handler to open modal
            card.addEventListener('click', () => {
                openModal(announcement);
            });
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

    // Create modal structure
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'announcement-modal';
        modal.innerHTML = `
            <div class="announcement-modal-content">
                <button class="announcement-modal-close">&times;</button>
                <div class="announcement-modal-header">
                    <h2 class="announcement-modal-title"></h2>
                </div>
                <div class="announcement-modal-body"></div>
                <div class="announcement-modal-footer">
                    <div class="announcement-modal-author">
                        <i class='bx bx-user'></i>
                        <span class="modal-author-name"></span>
                    </div>
                    <div class="announcement-modal-date">
                        <i class='bx bx-calendar'></i>
                        <span class="modal-date-text"></span>
                    </div>
                </div>
            </div>
        `;
        
        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal on close button click
        const closeBtn = modal.querySelector('.announcement-modal-close');
        closeBtn.addEventListener('click', closeModal);
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        return modal;
    }
    
    // Open modal with announcement data
    function openModal(announcement) {
        const modal = document.querySelector('.announcement-modal');
        const title = modal.querySelector('.announcement-modal-title');
        const body = modal.querySelector('.announcement-modal-body');
        const authorName = modal.querySelector('.modal-author-name');
        const dateText = modal.querySelector('.modal-date-text');
        
        const createdDate = new Date(announcement.created_at);
        const formattedDate = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        title.textContent = announcement.title;
        body.textContent = announcement.content;
        authorName.textContent = announcement.created_by_username || 'Admin';
        dateText.textContent = formattedDate;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        const modal = document.querySelector('.announcement-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Initialize by fetching announcements
    fetchAnnouncements();
});
