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
     * @param {boolean} confirmed - True to bypass time window confirmation
     * @returns {Promise<Object>} Result with success status
     */
    validateAndLogRfid: (rfid, tapCount, confirmed) => ipcRenderer.invoke('validate-and-log-rfid', rfid, tapCount, confirmed),
    
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
     * Get today's grade level counts (database-driven)
     * @returns {Promise<Object>} Grade level counts and order
     */
    getTodayGradeLevelCounts: () => ipcRenderer.invoke('get-today-grade-level-counts'),
    
    /**
     * Check if RFID was tapped recently for rate limiting
     * @param {string} rfid - The RFID to check
     * @param {number} seconds - Seconds to check back
     * @returns {Promise<boolean>} True if tapped recently
     */
    wasRfidTappedRecently: (rfid, seconds) => ipcRenderer.invoke('was-rfid-tapped-recently', rfid, seconds),
    
    /**
     * Get recent logs with enriched student information
     * @param {number} limit - Number of logs to fetch
     * @returns {Promise<Array>} Array of enriched logs
     */
    getRecentLogsWithStudentInfo: (limit) => ipcRenderer.invoke('get-recent-logs-with-student-info', limit),
    
    /**
     * Get today's logs for specific RFID
     * @param {string} rfid - The RFID to check
     * @returns {Promise<Array>} Array of today's logs for the RFID
     */
    getTodayLogsForRfid: (rfid) => ipcRenderer.invoke('get-today-logs-for-rfid', rfid),
    
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
     * Listen for immediate refresh signals (after successful RFID log)
     * @param {Function} callback - Called when immediate refresh is triggered
     */
    onImmediateRefresh: (callback) => {
        ipcRenderer.on('immediate-refresh', (event, data) => callback(data));
    },

    /**
     * Listen for polling refresh signals (fallback when realtime fails)
     * @param {Function} callback - Called when polling refresh is triggered
     */
    onPollingRefresh: (callback) => {
        ipcRenderer.on('polling-refresh', (event, data) => callback(data));
    },
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen: () => {
        ipcRenderer.send('window:toggle-fullscreen');
    },

    /**
     * Get student from cache (instant)
     * @param {string} rfid - The RFID/UID
     * @returns {Object|null} Student data from cache
     */
    getStudentFromCache: (rfid) => ipcRenderer.invoke('get-student-from-cache', rfid),

    /**
     * Refresh student cache
     * @returns {Promise<Object>} Refresh result with cache stats
     */
    refreshStudentCache: () => ipcRenderer.invoke('refresh-student-cache'),

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats: () => ipcRenderer.invoke('get-cache-stats'),

    /**
     * Set the early timeout threshold
     * @param {number} minutes - Threshold in minutes
     * @returns {Promise<Object>} Result status
     */
    setTimeoutThreshold: (minutes) => ipcRenderer.invoke('set-timeout-threshold', minutes),

    /**
     * Get the current timeout threshold
     * @returns {Promise<number>} Threshold in minutes
     */
    getTimeoutThreshold: () => ipcRenderer.invoke('get-timeout-threshold')
});
