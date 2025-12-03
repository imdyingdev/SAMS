// Event Handlers Module - Keyboard and Mouse Events
export class EventHandlers {
    constructor(displayManager, rfidHandler, uiComponents) {
        this.displayManager = displayManager;
        this.rfidHandler = rfidHandler;
        this.uiComponents = uiComponents;
        this.currentRfid = '';
        this.pendingRfid = '';
        this.timeInterval = null;
    }

    // Initialize all event handlers
    init() {
        this.setupKeyboardEvents();
        this.setupModalEvents();
        this.setupButtonEvents();
        this.setupDoubleClickFullscreen();
        this.setupTimeDisplay();
        this.setupSettingsPanel();
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

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSettingsOverlay();
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

    // Setup time display
    setupTimeDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        
        const updateTime = () => {
            const now = new Date();
            const options = {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            timeDisplay.textContent = now.toLocaleString('en-US', options);
        };
        
        // Update immediately and then every second
        updateTime();
        this.timeInterval = setInterval(updateTime, 1000);
    }

    // Setup settings panel
    setupSettingsPanel() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        const timeoutSelect = document.getElementById('timeoutThreshold');
        const customTimeContainer = document.getElementById('customTimeContainer');
        const customTimeInput = document.getElementById('customTimeMinutes');
        const saveBtn = document.getElementById('saveSettingsBtn');
        const closeBtn = document.getElementById('closeSettingsBtn');

        // Load saved threshold or default to 1 minute
        const savedThreshold = localStorage.getItem('timeoutThreshold') || '1';
        const savedCustomTime = localStorage.getItem('customTimeMinutes') || '10';
        
        // Check if saved threshold is a custom value (>5 minutes)
        if (parseFloat(savedThreshold) > 5) {
            timeoutSelect.value = 'custom';
            customTimeContainer.style.display = 'block';
            customTimeInput.value = Math.round(parseFloat(savedThreshold));
        } else {
            timeoutSelect.value = savedThreshold;
            customTimeContainer.style.display = 'none';
        }

        // Toggle custom time input visibility
        timeoutSelect.addEventListener('change', () => {
            if (timeoutSelect.value === 'custom') {
                customTimeContainer.style.display = 'block';
            } else {
                customTimeContainer.style.display = 'none';
            }
        });

        // Validate custom time input
        customTimeInput.addEventListener('input', () => {
            let value = parseInt(customTimeInput.value);
            
            // Ensure value is within range
            if (value < 10) value = 10;
            if (value > 180) value = 180;
            
            // Round to nearest 10
            value = Math.round(value / 10) * 10;
            
            customTimeInput.value = value;
        });

        // Sync threshold with main process on startup
        if (window.rfidAPI && window.rfidAPI.setTimeoutThreshold) {
            window.rfidAPI.setTimeoutThreshold(parseFloat(savedThreshold));
            console.log('Synced timeout threshold on startup:', savedThreshold, 'minutes');
        }

        // Save button
        saveBtn.addEventListener('click', () => {
            let newThreshold;
            
            if (timeoutSelect.value === 'custom') {
                // Use custom time value
                newThreshold = customTimeInput.value;
                
                // Validate custom time
                let customValue = parseInt(newThreshold);
                if (customValue < 10 || customValue > 180 || customValue % 10 !== 0) {
                    alert('Custom time must be between 10 and 180 minutes in 10-minute increments.');
                    return;
                }
                
                localStorage.setItem('customTimeMinutes', newThreshold);
            } else {
                newThreshold = timeoutSelect.value;
            }
            
            localStorage.setItem('timeoutThreshold', newThreshold);
            
            // Notify main process of threshold change
            if (window.rfidAPI && window.rfidAPI.setTimeoutThreshold) {
                window.rfidAPI.setTimeoutThreshold(parseFloat(newThreshold));
            }
            
            console.log('Timeout threshold saved:', newThreshold, 'minutes');
            this.toggleSettingsOverlay();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            // Reset to saved values
            const savedThreshold = localStorage.getItem('timeoutThreshold') || '1';
            const savedCustomTime = localStorage.getItem('customTimeMinutes') || '10';
            
            if (parseFloat(savedThreshold) > 5) {
                timeoutSelect.value = 'custom';
                customTimeContainer.style.display = 'block';
                customTimeInput.value = savedCustomTime;
            } else {
                timeoutSelect.value = savedThreshold;
                customTimeContainer.style.display = 'none';
            }
            
            this.toggleSettingsOverlay();
        });

        // Close on overlay click
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                // Reset to saved values
                const savedThreshold = localStorage.getItem('timeoutThreshold') || '1';
                const savedCustomTime = localStorage.getItem('customTimeMinutes') || '10';
                
                if (parseFloat(savedThreshold) > 5) {
                    timeoutSelect.value = 'custom';
                    customTimeContainer.style.display = 'block';
                    customTimeInput.value = savedCustomTime;
                } else {
                    timeoutSelect.value = savedThreshold;
                    customTimeContainer.style.display = 'none';
                }
                
                this.toggleSettingsOverlay();
            }
        });
    }

    // Toggle settings overlay
    toggleSettingsOverlay() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        settingsOverlay.classList.toggle('show');
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
