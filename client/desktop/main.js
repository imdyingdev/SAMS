const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    resizable: false,
    maximizable: true,
    fullscreenable: true,
    frame: false, // ❌ Removes default OS window frame
    titleBarStyle: 'hidden', // Optional, improves look on macOS
    webPreferences: {
      nodeIntegration: true, // Or use preload if you prefer security
      contextIsolation: false
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
