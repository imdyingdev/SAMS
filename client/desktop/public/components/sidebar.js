// Sidebar component functionality
export function initializeSidebar() {
    console.log('🔧 Initializing sidebar component...');

    // Add click handler for settings toggle
    const settingsLink = document.getElementById('nav-settings');
    if (settingsLink) {
        settingsLink.addEventListener('click', toggleSettingsPanel);
    }

    console.log('✅ Sidebar component initialized');
}

function toggleSettingsPanel(event) {
    event.preventDefault();
    event.stopPropagation();

    const settingsPanel = document.getElementById('settings-panel');
    if (settingsPanel) {
        const isVisible = settingsPanel.style.display !== 'none';
        settingsPanel.style.display = isVisible ? 'none' : 'block';

        // Optional: Add smooth animation
        if (!isVisible) {
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(-10px)';
            settingsPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                settingsPanel.style.opacity = '1';
                settingsPanel.style.transform = 'translateY(0)';
            }, 10);
        }
    }
}

// Export for use in other modules
window.initializeSidebar = initializeSidebar;