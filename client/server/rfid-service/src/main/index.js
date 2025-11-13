// Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getStudentByRfid } = require('../services/studentService');
const { studentCache } = require('../services/studentCache');
const { 
    validateAndLogRfid, 
    getRecentLogs, 
    getTodayStudentCount,
    getTodayLogsForRfid,
    getTodayGradeLevelCounts,
    wasRfidTappedRecently,
    getRecentLogsWithStudentInfo,
    initializeRealtimeSubscription,
    cleanupRealtimeSubscription
} = require('../services/rfidLogService');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../../dist/preload.js')
        },
        alwaysOnTop: false,
        resizable: false,
        title: 'SAMS RFID Scanner',
        frame: false,
        titleBarStyle: 'hidden',
        fullscreen: false,
        fullscreenable: true
    });

    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));

    // Track window focus state
    mainWindow.on('focus', () => {
        console.log('Window focused - sending immediate refresh');
        mainWindow.webContents.send('window-focus-changed', true);
        // Immediately refresh when window regains focus
        mainWindow.webContents.send('immediate-refresh', { 
            timestamp: new Date().toISOString(),
            reason: 'window-focus'
        });
    });

    mainWindow.on('blur', () => {
        console.log('Window blurred - pausing polling');
        mainWindow.webContents.send('window-focus-changed', false);
    });

    // Initialize real-time subscription when window is ready
    mainWindow.webContents.once('did-finish-load', async () => {
        console.log('Main window loaded, initializing real-time subscription...');
        
        // Initialize student cache for instant RFID responses
        console.log('Initializing student cache...');
        await studentCache.initialize();
        console.log('Student cache initialized');
        
        // Set up periodic cache refresh (every 30 minutes)
        setInterval(async () => {
            if (studentCache.isStale()) {
                console.log('Cache is stale, refreshing...');
                await studentCache.refresh();
            }
        }, 30 * 60 * 1000); // 30 minutes
        
        // Try to initialize real-time subscription
        const success = initializeRealtimeSubscription((changeData) => {
            const notificationTime = new Date();
            const changeTimestamp = changeData.timestamp;
            const totalDelay = changeTimestamp ? (notificationTime - new Date(changeTimestamp)) : 'unknown';
            
            console.log('Forwarding real-time change to renderer:', {
                eventType: changeData.eventType,
                changeTimestamp: changeTimestamp,
                notificationTime: notificationTime.toISOString(),
                totalDelay: typeof totalDelay === 'number' ? `${totalDelay.toFixed(2)}ms` : totalDelay
            });
            
            // Send real-time updates to renderer
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('log-change', changeData);
            }
        });
        
        if (success) {
            console.log('Real-time subscription setup complete');
        } else {
            console.error('Real-time subscription failed - enabling polling fallback');
            // Enable polling fallback when realtime fails
            enablePollingFallback();
        }
    });

    // Polling fallback function with smart focus detection
    let pollingInterval = null;
    
    function enablePollingFallback() {
        console.log('Enabling 1.5-second smart polling (only when focused)');
        
        // Start polling immediately if window is focused
        if (mainWindow && mainWindow.isFocused()) {
            startPolling();
        }
        
        // Listen for focus changes to start/stop polling
        mainWindow.on('focus', () => {
            if (!pollingInterval) {
                console.log('Window focused - starting polling');
                startPolling();
            }
        });
        
        mainWindow.on('blur', () => {
            if (pollingInterval) {
                console.log('Window unfocused - stopping polling');
                stopPolling();
            }
        });
    }
    
    function startPolling() {
        if (pollingInterval) return; // Already polling
        
        // Send immediate refresh when starting
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('polling-refresh', { timestamp: new Date().toISOString() });
        }
        
        // Start interval
        pollingInterval = setInterval(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('polling-refresh', { timestamp: new Date().toISOString() });
            }
        }, 1500); // Poll every 1.5 seconds
    }
    
    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }

    // Cleanup subscription when window is closed
    mainWindow.on('closed', () => {
        cleanupRealtimeSubscription();
        stopPolling(); // Stop polling interval
        mainWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('get-student-by-rfid', async (event, rfid) => {
    return await getStudentByRfid(rfid);
});

// Cache handlers for instant RFID response
ipcMain.handle('get-student-from-cache', (event, rfid) => {
    return studentCache.getStudent(rfid);
});

ipcMain.handle('refresh-student-cache', async () => {
    await studentCache.refresh();
    return { success: true, stats: studentCache.getStats() };
});

ipcMain.handle('get-cache-stats', () => {
    return studentCache.getStats();
});

ipcMain.handle('validate-and-log-rfid', async (event, rfid, tapCount, confirmed) => {
    const result = await validateAndLogRfid(rfid, tapCount, confirmed);
    
    // If logging was successful, trigger immediate refresh
    if (result && result.success) {
        console.log('Triggering immediate refresh after successful RFID log');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('immediate-refresh', { 
                timestamp: new Date().toISOString(),
                rfid: rfid,
                tapCount: tapCount
            });
        }
    }
    
    return result;
});

ipcMain.handle('get-recent-logs', async (event, limit) => {
    return await getRecentLogs(limit);
});

ipcMain.handle('get-today-count', async () => {
    return await getTodayStudentCount();
});

// New database-driven functions
ipcMain.handle('get-today-grade-level-counts', async () => {
    return await getTodayGradeLevelCounts();
});

ipcMain.handle('was-rfid-tapped-recently', async (event, rfid, seconds) => {
    return await wasRfidTappedRecently(rfid, seconds);
});

ipcMain.handle('get-recent-logs-with-student-info', async (event, limit) => {
    return await getRecentLogsWithStudentInfo(limit);
});

ipcMain.handle('get-today-logs-for-rfid', async (event, rfid) => {
    return await getTodayLogsForRfid(rfid);
});

// Manual refresh handler (fallback if real-time fails)
ipcMain.handle('manual-refresh', async () => {
    console.log('Manual refresh requested');
    return { success: true, message: 'Refresh triggered' };
});

// Toggle fullscreen handler
ipcMain.on('window:toggle-fullscreen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // Cleanup real-time subscription
    cleanupRealtimeSubscription();
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', () => {
    // Cleanup real-time subscription before quitting
    cleanupRealtimeSubscription();
});
