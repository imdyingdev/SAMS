// Main Application Coordinator - Clean, Modular RFID Scanner
import { DisplayManager } from './modules/displayManager.js';
import { DataManager } from './modules/dataManager.js';
import { RfidHandler } from './modules/rfidHandler.js';
import { EventHandlers } from './modules/eventHandlers.js';
import { UIComponents } from './modules/uiComponents.js';

/**
 * RFID Scanner Application
 * Modular, database-driven architecture with clean separation of concerns
 */
class RfidScannerApp {
    constructor() {
        this.displayManager = null;
        this.dataManager = null;
        this.rfidHandler = null;
        this.eventHandlers = null;
        this.uiComponents = null;
    }

    // Initialize the application
    async init() {
        try {
            console.log('🚀 Initializing RFID Scanner Application...');

            // Initialize modules in dependency order
            this.displayManager = new DisplayManager();
            this.dataManager = new DataManager();
            this.uiComponents = new UIComponents();
            
            // Initialize modules that depend on others
            this.rfidHandler = new RfidHandler(this.displayManager, this.dataManager);
            this.eventHandlers = new EventHandlers(this.displayManager, this.rfidHandler, this.uiComponents);

            // Initialize all modules
            this.displayManager.init();
            this.dataManager.init();
            this.uiComponents.init();
            this.eventHandlers.init();

            console.log('✅ RFID Scanner Application initialized successfully');

        } catch (error) {
            console.error('❌ Error initializing RFID Scanner Application:', error);
            this.displayManager?.showError('Application initialization failed');
        }
    }

    // Get module instances (for debugging or external access)
    getModules() {
        return {
            display: this.displayManager,
            data: this.dataManager,
            rfid: this.rfidHandler,
            events: this.eventHandlers,
            ui: this.uiComponents
        };
    }
}

// Initialize and start the application
document.addEventListener('DOMContentLoaded', async () => {
    const app = new RfidScannerApp();
    await app.init();
    
    // Make app available globally for debugging
    window.rfidApp = app;
});

// Export for potential external use
export default RfidScannerApp;
