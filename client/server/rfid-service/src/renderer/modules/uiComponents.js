// UI Components Module - Modals, Overlays, and Interactive Elements
export class UIComponents {
    constructor() {
        this.howBtn = document.getElementById('howBtn');
        this.howOverlay = document.getElementById('howOverlay');
        this.isHowOverlayVisibleState = false;
    }

    // Initialize UI components
    init() {
        this.setupHowOverlay();
    }

    // Setup How overlay functionality
    setupHowOverlay() {
        // How overlay click handler
        this.howOverlay.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleHowOverlay();
        });
    }

    // Toggle How overlay visibility
    toggleHowOverlay() {
        this.isHowOverlayVisibleState = !this.isHowOverlayVisibleState;
        
        if (this.isHowOverlayVisibleState) {
            this.howOverlay.style.display = 'flex';
            // Trigger reflow to ensure animation works
            this.howOverlay.offsetHeight;
            this.howOverlay.classList.add('show');
        } else {
            this.howOverlay.classList.remove('show');
            setTimeout(() => {
                this.howOverlay.style.display = 'none';
            }, 600); // Match transition duration
        }
    }

    // Check if How overlay is visible
    isHowOverlayVisible() {
        return this.isHowOverlayVisibleState;
    }

    // Show confirmation modal
    showConfirmModal(title, message, onConfirm, onCancel) {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.style.display = 'flex';
            // You can extend this to set dynamic title/message if needed
        }
    }

    // Hide confirmation modal
    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}
