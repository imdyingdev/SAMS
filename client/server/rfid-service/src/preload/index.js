// Preload script - Bridge between main and renderer processes
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('rfidAPI', {
    /**
     * Get student information by RFID
     * @param {string} rfid - The RFID/UID
     * @returns {Promise<Object|null>} Student data
     */
    getStudentByRfid: (rfid) => ipcRenderer.invoke('get-student-by-rfid', rfid),
    
    /**
     * Validate and log RFID scan
     * @param {string} rfid - The RFID/UID
     * @param {number} tapCount - 1 or 2
     * @returns {Promise<Object>} Result with success status
     */
    validateAndLogRfid: (rfid, tapCount) => ipcRenderer.invoke('validate-and-log-rfid', rfid, tapCount),
    
    /**
     * Get recent RFID logs
     * @param {number} limit - Number of logs to fetch
     * @returns {Promise<Array>} Array of logs
     */
    getRecentLogs: (limit) => ipcRenderer.invoke('get-recent-logs', limit),
    
    /**
     * Get today's student count
     * @returns {Promise<number>} Count of unique students
     */
    getTodayCount: () => ipcRenderer.invoke('get-today-count'),
    
    /**
     * Manual refresh (fallback if real-time fails)
     * @returns {Promise<Object>} Success status
     */
    manualRefresh: () => ipcRenderer.invoke('manual-refresh'),
    
    /**
     * Listen for window focus changes
     * @param {Function} callback - Called with true when focused, false when blurred
     */
    onFocusChanged: (callback) => {
        ipcRenderer.on('window-focus-changed', (event, isFocused) => callback(isFocused));
    },
    
    /**
     * Listen for real-time log changes
     * @param {Function} callback - Called when logs are added, updated, or deleted
     */
    onLogChange: (callback) => {
        ipcRenderer.on('log-change', (event, changeData) => callback(changeData));
    },
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen: () => {
        ipcRenderer.send('window:toggle-fullscreen');
    }
});
