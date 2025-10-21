import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { testConnection } from './database/db-connection.js';
import { authenticateUser, createDefaultAdmin } from './database/auth-service.js';
import { initializeTables } from './database/db-init.js';
import { saveStudent, getAllStudents, getStudentsPaginated, deleteStudent, updateStudent, getStudentById } from './database/student-service.js';
import { getStudentStatsByGrade, getStudentStatsByGender } from './database/stats-service.js';
import { getLogsPaginated, getRecentLogs, createLogEntry, logRfidActivity, logStudentActivity, logAuthActivity } from './database/logs-service.js';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES6 module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable live reload for Electron in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Skip electron-reload in ES6 modules due to compatibility issues
    console.log('Development mode: electron-reload disabled for ES6 compatibility');
  } catch (error) {
    console.error('Error setting up electron-reload:', error);
  }
}

// RFID Scanner variables
let port;
let parser;

// Keep a global reference of the window object
let mainWindow;
let isWindowMaximized = false; // Our reliable state tracker
const isDev = process.env.NODE_ENV === 'development';

// Enable backdrop-filter support
app.commandLine.appendSwitch('enable-features', 'BackdropFilter');
app.commandLine.appendSwitch('CSSBackdropFilter');
app.commandLine.appendSwitch('enable-experimental-web-platform-features');

// Add these to your existing main.js
app.commandLine.appendSwitch('enable-unsafe-webgpu'); // Sometimes needed

/**
 * Create the main application window
 */
async function createWindow() {
  console.log('Starting AMPID Attendance System...');
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', process.cwd());
  
  // Check if HTML file exists BEFORE trying to load it
  const htmlPath = path.join(__dirname, '../public/views/index.html');
  console.log('Looking for HTML at:', htmlPath);
  console.log('HTML file exists:', fs.existsSync(htmlPath));
  
  // List contents of public directory
  const publicDir = path.join(__dirname, '../public');
  console.log('Public directory path:', publicDir);
  console.log('Public directory exists:', fs.existsSync(publicDir));
  
  if (fs.existsSync(publicDir)) {
    console.log('Contents of public directory:');
    try {
      const files = fs.readdirSync(publicDir);
      files.forEach(file => console.log('  -', file));
    } catch (err) {
      console.error('Error reading public directory:', err);
    }
  }

  // Skip database initialization for now
  // await initializeDatabase();

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    resizable: false,
    maximizable: true,
    fullscreenable: true,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '../public/assets/media/sams-ico.png'),

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'dist', 'preload.js'),

      
      // webSecurity: true,
      // experimentalFeatures: true,  // Enable experimental features
      // additionalArguments: [
      //   '--enable-features=BackdropFilter',
      //   '--enable-experimental-web-platform-features'
      // ]
    },
  });

  console.log('BrowserWindow created');

  try {
    console.log('Attempting to load HTML file...');
    await mainWindow.loadFile(htmlPath);
    console.log('HTML file loaded successfully');
  } catch (error) {
    console.error('Failed to load HTML file:', error.message);
    console.error('Error details:', error);
    
    // Create a simple test page
    console.log('Loading fallback HTML...');
    const fallbackHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AMPID Attendance System - Debug</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              background: rgba(255,255,255,0.1);
              padding: 30px;
              border-radius: 15px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            .success { color: #2ecc71; }
            .error { color: #e74c3c; }
            .info { color: #3498db; }
            code { 
              background: rgba(0,0,0,0.3); 
              padding: 2px 6px; 
              border-radius: 4px; 
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 AMPID Attendance System</h1>
            <p class="error">⚠️ Could not load the main application file.</p>
            
            <h3>🔍 Debug Information:</h3>
            <ul>
              <li><strong>App Directory:</strong> <code>${__dirname}</code></li>
              <li><strong>Looking for HTML at:</strong> <code>${htmlPath}</code></li>
              <li><strong>HTML file exists:</strong> <code>${fs.existsSync(htmlPath)}</code></li>
              <li><strong>Public directory exists:</strong> <code>${fs.existsSync(publicDir)}</code></li>
              <li><strong>Working directory:</strong> <code>${process.cwd()}</code></li>
            </ul>
            
            <h3>📁 Expected Project Structure:</h3>
            <pre>
project/
├── src/
│   ├── main.js
│   ├── preload.js
│   └── database.js
├── public/
│   ├── index.html  ← This file is missing!
│   └── dashboard.html
└── package.json
            </pre>
            
            <p class="info">✅ If you can see this page, Electron is working fine!</p>
            <p class="info">🔧 Please create the missing HTML files in the public/ directory.</p>
          </div>
        </body>
      </html>
    `;
    
    await mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fallbackHtml)}`);
    console.log('Fallback HTML loaded');
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('ready-to-show event fired');
    mainWindow.show();
    console.log('Application window shown');
    
    // Focus on window for better UX
    if (isDev) {
      // mainWindow.webContents.openDevTools();
    }
  });



  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    console.log('Main window closed');
  });

  console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
  // Open DevTools automatically in development
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.webContents.openDevTools();
  // }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    import('electron').then(({ shell }) => shell.openExternal(url));
    return { action: 'deny' };
  });

  console.log('Application window created successfully');
}

// Handle window controls - Reset and clean implementation
ipcMain.handle('window:minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:toggle-fullscreen', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

ipcMain.on('window:open-devtools', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.openDevTools();
  }
});

ipcMain.on('close-app', () => {
  app.quit();
});

/**
 * Application event handlers
 */
app.whenReady().then(() => {
  console.log('App ready event fired');
  
  // Set application menu (remove default menu in production)
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }
  
  createWindow().catch(error => {
    console.error('Failed to create window:', error);
  });

  // macOS specific: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
// Gracefully close serial port on app quit
app.on('before-quit', () => {
  if (port && port.isOpen) {
    port.close();
  }
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers ---

// Handle student save request
ipcMain.handle('save-student', async (event, studentData) => {
  try {
    const result = await saveStudent(studentData);
    return result;
  } catch (error) {
    console.error('IPC Error: Failed to save student', error);
    // Forward the specific error message to the renderer process
    throw new Error(error.message || 'An unknown error occurred on the server.');
  }
});

// Enhanced error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Simple logout handler - direct navigation like experiment
ipcMain.on('logout', () => {
  console.log('Logout requested - navigating to login');
  const loginPath = path.join(__dirname, '../public/views/index.html');
  mainWindow.loadFile(loginPath);
});

// Simplified navigation function for dashboard and students only
async function handleNavigation(page) {
  console.log(`Navigation request to: ${page}`);
  
  try {
    let filePath;
    switch (page) {
      case 'dashboard':
        filePath = path.join(__dirname, '../public', 'views', 'dashboard.html');
        break;
      case 'students':
        // Students is now a view within the dashboard SPA
        filePath = path.join(__dirname, '../public', 'views', 'dashboard.html');
        break;
      case 'login':
        filePath = path.join(__dirname, '../public', 'views', 'index.html');
        break;
      case 'loading':
        filePath = path.join(__dirname, '../public', 'components', 'loading.html');
        break;
      default:
        console.warn(`Unknown page: ${page}`);
        return { success: false, message: `Unknown page: ${page}` };
    }
    
    console.log(`Loading file: ${filePath}`);
    
    // Check if file exists before trying to load it
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return { success: false, message: `File not found: ${filePath}` };
    }
    
    // Load the file and then send the target view to the renderer
    await mainWindow.loadFile(filePath);
    
    if (page === 'students') {
      // Send a message to the renderer to navigate to students view
      await mainWindow.webContents.executeJavaScript(`
        if (window.navigateToView) {
          window.navigateToView('students');
        } else {
          // If not ready yet, wait and try again
          setTimeout(() => {
            if (window.navigateToView) {
              window.navigateToView('students');
            }
          }, 500);
        }
      `);
    } else if (page === 'dashboard') {
      // Ensure we navigate to home view when going to dashboard
      await mainWindow.webContents.executeJavaScript(`
        if (window.navigateToView) {
          window.navigateToView('home');
        } else {
          // If not ready yet, wait and try again
          setTimeout(() => {
            if (window.navigateToView) {
              window.navigateToView('home');
            }
          }, 500);
        }
      `);
    }
    
    return { success: true, message: `Navigated to ${page}` };
  } catch (error) {
    console.error(`Navigation error:`, error);
    return { success: false, message: error.message };
  }
}

// Simplified navigation - removed complex state management

ipcMain.handle('nav:navigate-to', async (event, page) => {
  return await handleNavigation(page);
});

// --- RFID Scanner Logic ---

async function initializeRfidScanner() {
  try {
    const ports = await SerialPort.list();
    const arduinoPort = ports.find(p => p.manufacturer?.toLowerCase().includes('arduino') || p.pnpId?.includes('VID_2341'));

    if (!arduinoPort) {
      console.warn('RFID reader (Arduino) not found.');
      return;
    }

    port = new SerialPort({ path: arduinoPort.path, baudRate: 9600 });
    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.on('open', () => console.log('Serial port open for RFID scanner.'));
    port.on('error', (err) => console.error('Serial port error:', err));

    parser.on('data', (data) => {
      const rfidTag = data.trim();
      console.log(`RFID Scanned: ${rfidTag}`);
      if (mainWindow) {
        mainWindow.webContents.send('rfid:scan-data', rfidTag);
      }
    });

  } catch (error) {
    console.error('Failed to initialize RFID scanner:', error);
  }
}

ipcMain.on('rfid:start-scan', () => {
  console.log('Received request to start RFID scan');
  if (!port || !port.isOpen) {
    initializeRfidScanner();
  } else {
    console.log('RFID scanner already active.');
  }
});

ipcMain.on('rfid:stop-scan', () => {
  console.log('Received request to stop RFID scan');
  if (port && port.isOpen) {
    port.close(err => {
      if (err) {
        return console.error('Failed to close port:', err.message);
      }
      console.log('Serial port closed.');
    });
  }
});

// === ADDITIONAL DATABASE IPC HANDLERS ===

// Get all students handler (kept for backward compatibility)
ipcMain.handle('get-all-students', async (event) => {
  try {
    console.log('IPC: Fetching all students');
    const students = await getAllStudents();
    console.log('IPC: Sending student data to renderer:', JSON.stringify(students, null, 2));
    return students;
  } catch (error) {
    console.error('IPC: Failed to get students:', error);
    throw error;
  }
});

// Get paginated students handler
ipcMain.handle('get-students-paginated', async (event, page = 1, pageSize = 50, searchTerm = '', gradeFilter = '', rfidFilter = '') => {
  try {
    console.log(`IPC: Fetching students page ${page} with filters`);
    const result = await getStudentsPaginated(page, pageSize, searchTerm, gradeFilter, rfidFilter);
    console.log(`IPC: Sending paginated student data: ${result.students.length} students, page ${result.pagination.currentPage}/${result.pagination.totalPages}`);
    return result;
  } catch (error) {
    console.error('IPC: Failed to get paginated students:', error);
    throw error;
  }
});

// Delete student handler
ipcMain.handle('delete-student', async (event, studentId) => {
  try {
    console.log(`IPC: Deleting student with ID: ${studentId}`);
    const result = await deleteStudent(studentId);
    return result;
  } catch (error) {
    console.error('IPC: Failed to delete student:', error);
    throw error;
  }
});

// Update student handler
ipcMain.handle('update-student', async (event, { studentId, studentData }) => {
  try {
    console.log(`IPC: Updating student with ID: ${studentId}`);
    const result = await updateStudent(studentId, studentData);
    return result;
  } catch (error) {
    console.error('IPC: Failed to update student:', error);
    throw error;
  }
});

// Get student by ID handler
ipcMain.handle('get-student-by-id', async (event, studentId) => {
  try {
    console.log(`IPC: Fetching student with ID: ${studentId}`);
    const student = await getStudentById(studentId);
    return student;
  } catch (error) {
    console.error('IPC: Failed to get student:', error);
    throw error;
  }
});

// Authentication handler
ipcMain.handle('auth:login', async (event, credentials) => {
  try {
    console.log('IPC: Authenticating user:', credentials.username);
    const result = await authenticateUser(credentials.username, credentials.password);
    return result;
  } catch (error) {
    console.error('IPC: Authentication failed:', error);
    throw error;
  }
});

// Get student statistics by grade handler
ipcMain.handle('get-student-stats-by-grade', async (event) => {
  try {
    console.log('IPC: Fetching student statistics by grade');
    const stats = await getStudentStatsByGrade();
    return stats;
  } catch (error) {
    console.error('IPC: Failed to fetch student statistics:', error);
    throw error;
  }
});

// Get student statistics by gender handler
ipcMain.handle('get-student-stats-by-gender', async (event) => {
  try {
    console.log('IPC: Fetching student statistics by gender');
    const stats = await getStudentStatsByGender();
    return stats;
  } catch (error) {
    console.error('IPC: Failed to fetch gender statistics:', error);
    throw error;
  }
});

// System version handler
ipcMain.handle('system:get-version', async (event) => {
  return {
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome,
    app: app.getVersion()
  };
});

// === LOGS IPC HANDLERS ===

// Get paginated logs handler
ipcMain.handle('get-logs-paginated', async (event, page = 1, pageSize = 50, searchTerm = '', logTypeFilter = '', dateFilter = '') => {
  try {
    console.log(`IPC: Fetching logs page ${page} with filters`);
    const result = await getLogsPaginated(page, pageSize, searchTerm, logTypeFilter, dateFilter);
    console.log(`IPC: Sending paginated logs data: ${result.logs.length} logs, page ${result.pagination.currentPage}/${result.pagination.totalPages}`);
    return result;
  } catch (error) {
    console.error('IPC: Failed to get paginated logs:', error);
    throw error;
  }
});

// Get recent logs handler
ipcMain.handle('get-recent-logs', async (event, limit = 10) => {
  try {
    console.log(`IPC: Fetching ${limit} recent logs`);
    const logs = await getRecentLogs(limit);
    return logs;
  } catch (error) {
    console.error('IPC: Failed to get recent logs:', error);
    throw error;
  }
});

// Create log entry handler
ipcMain.handle('create-log-entry', async (event, logType, description, rfid = null, studentId = null, details = null) => {
  try {
    console.log(`IPC: Creating log entry: ${logType} - ${description}`);
    const result = await createLogEntry(logType, description, rfid, studentId, details);
    return result;
  } catch (error) {
    console.error('IPC: Failed to create log entry:', error);
    throw error;
  }
});

console.log('Main.js loaded successfully');