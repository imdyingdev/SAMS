// Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getStudentByRfid } = require('../services/studentService');
const { 
    validateAndLogRfid, 
    getRecentLogs, 
    getTodayStudentCount,
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
            preload: path.join(__dirname, '../preload/index.js')
        },
        alwaysOnTop: false,
        resizable: false,
        title: 'SAMS RFID Scanner',
        frame: false,
        titleBarStyle: 'hidden',
        fullscreen: false
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Track window focus state
    mainWindow.on('focus', () => {
        mainWindow.webContents.send('window-focus-changed', true);
    });

    mainWindow.on('blur', () => {
        mainWindow.webContents.send('window-focus-changed', false);
    });

    // Initialize real-time subscription when window is ready
    mainWindow.webContents.once('did-finish-load', () => {
        console.log('🖥️ Main window loaded, initializing real-time subscription...');
        
        const success = initializeRealtimeSubscription((changeData) => {
            console.log('📤 Forwarding real-time change to renderer:', changeData.eventType);
            
            // Send real-time updates to renderer
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('log-change', changeData);
            }
        });
        
        if (success) {
            console.log('✅ Real-time subscription setup complete');
        } else {
            console.error('❌ Failed to setup real-time subscription');
        }
    });

    // Cleanup subscription when window is closed
    mainWindow.on('closed', () => {
        cleanupRealtimeSubscription();
        mainWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('get-student-by-rfid', async (event, rfid) => {
    return await getStudentByRfid(rfid);
});

ipcMain.handle('validate-and-log-rfid', async (event, rfid, tapCount) => {
    return await validateAndLogRfid(rfid, tapCount);
});

ipcMain.handle('get-recent-logs', async (event, limit) => {
    return await getRecentLogs(limit);
});

ipcMain.handle('get-today-count', async () => {
    return await getTodayStudentCount();
});

// Manual refresh handler (fallback if real-time fails)
ipcMain.handle('manual-refresh', async () => {
    console.log('🔄 Manual refresh requested');
    return { success: true, message: 'Refresh triggered' };
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
