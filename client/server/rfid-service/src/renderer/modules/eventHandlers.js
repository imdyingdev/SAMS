// Event Handlers Module - Keyboard and Mouse Events
export class EventHandlers {
    constructor(displayManager, rfidHandler, uiComponents) {
        this.displayManager = displayManager;
        this.rfidHandler = rfidHandler;
        this.uiComponents = uiComponents;
        this.currentRfid = '';
        this.pendingRfid = '';
    }

    // Initialize all event handlers
    init() {
        this.setupKeyboardEvents();
        this.setupModalEvents();
        this.setupButtonEvents();
        this.setupDoubleClickFullscreen();
    }

    // Setup keyboard event handling for RFID input
    setupKeyboardEvents() {
        document.addEventListener('keypress', async (e) => {
            // Auto-hide How overlay if it's showing
            if (this.uiComponents.isHowOverlayVisible()) {
                this.uiComponents.toggleHowOverlay();
            }

            // Block RFID processing when modal is open or window not focused
            const modal = document.getElementById('confirmModal');
            if (modal.style.display === 'flex' || !this.displayManager.isWindowFocusedState()) {
                return;
            }

            if (e.key === 'Enter') {
                if (this.currentRfid) {
                    console.log('🎯 Enter key pressed, processing RFID:', this.currentRfid);
                    setTimeout(async () => {
                        const rfidToProcess = this.currentRfid;
                        this.currentRfid = '';

                        console.log('🚀 Starting RFID processing for:', rfidToProcess);
                        await this.rfidHandler.processRfid(rfidToProcess);
                    }, 150);
                } else {
                    console.log('⚠️ Enter pressed but no RFID stored');
                }
            } else {
                this.currentRfid += e.key;
                console.log('📝 Building RFID:', this.currentRfid);
                this.displayManager.showTyping(this.currentRfid);
            }
        });
    }

    // Setup modal event handlers
    setupModalEvents() {
        // Yes button - confirm timeout
        document.getElementById('yesBtn').addEventListener('click', async () => {
            document.getElementById('confirmModal').style.display = 'none';
            
            // Call the rfidHandler's confirmed timeout method
            await this.rfidHandler.handleConfirmedTimeout();
        });

        // No button - cancel timeout
        document.getElementById('noBtn').addEventListener('click', () => {
            document.getElementById('confirmModal').style.display = 'none';
            
            // Call the rfidHandler's cancel method
            this.rfidHandler.cancelTimeoutConfirmation();
        });
    }

    // Setup button event handlers
    setupButtonEvents() {
        // How button
        const howBtn = document.getElementById('howBtn');
        howBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.uiComponents.toggleHowOverlay();
        });

        // Prevent keyboard events on How button
        howBtn.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        howBtn.addEventListener('keypress', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add export functionality
            console.log('Export button clicked');
        });

        exportBtn.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        exportBtn.addEventListener('keypress', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add settings functionality
            console.log('Settings button clicked');
        });

        settingsBtn.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        settingsBtn.addEventListener('keypress', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    // Setup double-click fullscreen toggle
    setupDoubleClickFullscreen() {
        document.addEventListener('dblclick', (e) => {
            // Don't trigger fullscreen if clicking on buttons or interactive elements
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            // Toggle fullscreen
            window.rfidAPI.toggleFullscreen();
        });
    }

    // Set pending RFID for modal
    setPendingRfid(rfid) {
        this.pendingRfid = rfid;
    }

    // Get current RFID being typed
    getCurrentRfid() {
        return this.currentRfid;
    }

    // Clear current RFID
    clearCurrentRfid() {
        this.currentRfid = '';
    }
}
