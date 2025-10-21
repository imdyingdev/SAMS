// Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getStudentByRfid } = require('../services/studentService');
const { validateAndLogRfid, getRecentLogs, getTodayStudentCount } = require('../services/rfidLogService');

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

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
