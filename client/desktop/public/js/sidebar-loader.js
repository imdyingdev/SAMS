// Sidebar loader utility
export async function loadSidebar(activePage = 'home') {
    try {
        const response = await fetch('../components/sidebar.html');
        const sidebarHTML = await response.text();
        
        // Find the sidebar container or create one
        let sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) {
            sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'sidebar-container';
            
            // Insert sidebar into content-wrapper
            const contentWrapper = document.querySelector('.content-wrapper');
            if (contentWrapper) {
                contentWrapper.insertBefore(sidebarContainer, contentWrapper.firstChild);
            }
        }
        
        sidebarContainer.innerHTML = sidebarHTML;

        // Set active page - navigation is handled by SPA system in app.js
        setActivePage(activePage);

        // Initialize sidebar component functionality
        if (typeof window.initializeSidebar === 'function') {
            window.initializeSidebar();
        }

        console.log(`Sidebar loaded successfully with active page: ${activePage}`);
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

function setActivePage(activePage) {
    // Remove all active classes
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page
    const activeItem = document.querySelector(`[data-nav="${activePage}"]`);
    if (activeItem) {
        const navItem = activeItem.closest('.nav-item');
        if (navItem) {
            navItem.classList.add('active');
        }
    }
}
