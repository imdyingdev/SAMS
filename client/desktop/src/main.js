import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { testConnection } from './database/db-connection.js';
import { authenticateUser, createDefaultAdmin, updateUserRole } from './database/auth-service.js';
import { initializeTables } from './database/db-init.js';
import { createStudent, saveStudent, getAllStudents, getStudentsPaginated, deleteStudent, updateStudent, getStudentById, getUniqueGradeLevels, getUniqueSections, getStudentsForSF2 } from './database/student-service.js';
import { getStudentStatsByGrade, getStudentStatsByGender } from './database/stats-service.js';
import { getLogsPaginated, getRecentLogs, createLogEntry, logRfidActivity, logStudentActivity, logAuthActivity } from './database/logs-service.js';
import { createAnnouncement, getAllAnnouncements, getAnnouncementsCount, getAnnouncementById, updateAnnouncement, deleteAnnouncement, searchAnnouncements } from './database/announcement-service.js';
import { getTodayAttendanceStats } from './database/attendance-stats-service.js';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ExcelJS from 'exceljs';

// ES6 module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Development mode
if (process.env.NODE_ENV === 'development') {
  // electron-reload disabled for ES6 compatibility
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
  const htmlPath = path.join(__dirname, '../public/views/index.html');
  const publicDir = path.join(__dirname, '../public');

  // Initialize database and ensure default admin exists
  await initializeDatabase();

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
      preload: path.join(__dirname, 'preload.js'),

      
      // webSecurity: true,
      // experimentalFeatures: true,  // Enable experimental features
      // additionalArguments: [
      //   '--enable-features=BackdropFilter',
      //   '--enable-experimental-web-platform-features'
      // ]
    },
  });

  try {
    await mainWindow.loadFile(htmlPath);
  } catch (error) {
    console.error('[APP] Failed to load HTML file:', error.message);
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
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('[APP] SAMS Desktop started successfully');
    
    // Focus on window for better UX
    if (isDev) {
      // mainWindow.webContents.openDevTools();
    }
  });



  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    import('electron').then(({ shell }) => shell.openExternal(url));
    return { action: 'deny' };
  });
}

/**
 * Initialize database: test connection, create tables, ensure admin exists
 */
async function initializeDatabase() {
  try {
    console.log('[DATABASE] Initializing...');
    
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('[DATABASE] Connection failed');
      return false;
    }
    
    // Initialize tables
    const tablesCreated = await initializeTables();
    if (!tablesCreated) {
      console.error('[DATABASE] Failed to initialize tables');
      return false;
    }
    
    // Create default admin user
    await createDefaultAdmin();
    
    console.log('[DATABASE] Initialization complete');
    return true;
  } catch (error) {
    console.error('[DATABASE] Initialization error:', error.message);
    return false;
  }
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
  // Set application menu (remove default menu in production)
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }
  
  createWindow().catch(error => {
    console.error('[APP] Failed to create window:', error);
  });

  // macOS specific: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Gracefully close serial port on app quit
app.on('before-quit', () => {
  if (port && port.isOpen) {
    port.close();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers ---

// Handle create student request
ipcMain.handle('create-student', async (event, studentData) => {
  try {
    const result = await createStudent(studentData);
    return result;
  } catch (error) {
    console.error('Error creating student:', error);
    return { success: false, message: error.message };
  }
});

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

// Get user role handler
ipcMain.handle('auth:get-user-role', async (event, userId) => {
  try {
    console.log(`IPC: Getting role for user ID: ${userId}`);
    const { query } = await import('./database/db-connection.js');
    const sqlQuery = `
      SELECT role FROM admin_users
      WHERE id = $1 AND is_active = true
    `;
    const result = await query(sqlQuery, [userId]);

    if (result.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, role: result.rows[0].role };
  } catch (error) {
    console.error('IPC: Failed to get user role:', error);
    return { success: false, message: error.message };
  }
});

// Update user role handler
ipcMain.handle('auth:update-user-role', async (event, userId, newRole) => {
  try {
    console.log(`IPC: Updating role for user ID: ${userId} to ${newRole}`);
    const result = await updateUserRole(userId, newRole);
    return result;
  } catch (error) {
    console.error('IPC: Failed to update user role:', error);
    return { success: false, message: error.message };
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

// === ANNOUNCEMENTS IPC HANDLERS ===

// Create announcement handler
ipcMain.handle('create-announcement', async (event, announcementData) => {
  try {
    console.log('IPC: Creating announcement');
    const result = await createAnnouncement(announcementData);
    return result;
  } catch (error) {
    console.error('IPC: Failed to create announcement:', error);
    throw error;
  }
});

// Get all announcements handler
ipcMain.handle('get-all-announcements', async (event, limit = 50, offset = 0) => {
  try {
    console.log(`IPC: Fetching announcements (limit: ${limit}, offset: ${offset})`);
    const result = await getAllAnnouncements(limit, offset);
    return result;
  } catch (error) {
    console.error('IPC: Failed to get announcements:', error);
    throw error;
  }
});

// Get announcements count handler
ipcMain.handle('get-announcements-count', async (event) => {
  try {
    console.log('IPC: Fetching announcements count');
    const result = await getAnnouncementsCount();
    return result;
  } catch (error) {
    console.error('IPC: Failed to get announcements count:', error);
    throw error;
  }
});

// Get announcement by ID handler
ipcMain.handle('get-announcement-by-id', async (event, id) => {
  try {
    console.log(`IPC: Fetching announcement with ID: ${id}`);
    const result = await getAnnouncementById(id);
    return result;
  } catch (error) {
    console.error('IPC: Failed to get announcement by ID:', error);
    throw error;
  }
});

// Update announcement handler
ipcMain.handle('update-announcement', async (event, { id, announcementData }) => {
  try {
    console.log(`IPC: Updating announcement with ID: ${id}`);
    const result = await updateAnnouncement(id, announcementData);
    return result;
  } catch (error) {
    console.error('IPC: Failed to update announcement:', error);
    throw error;
  }
});

// Delete announcement handler
ipcMain.handle('delete-announcement', async (event, id) => {
  try {
    console.log(`IPC: Deleting announcement with ID: ${id}`);
    const result = await deleteAnnouncement(id);
    return result;
  } catch (error) {
    console.error('IPC: Failed to delete announcement:', error);
    throw error;
  }
});

// Search announcements handler
ipcMain.handle('search-announcements', async (event, searchTerm, limit = 50, offset = 0) => {
  try {
    console.log(`IPC: Searching announcements with term: ${searchTerm}`);
    const result = await searchAnnouncements(searchTerm, limit, offset);
    return result;
  } catch (error) {
    console.error('IPC: Failed to search announcements:', error);
    throw error;
  }
});

// === ATTENDANCE STATISTICS IPC HANDLERS ===

// Get today's attendance statistics handler
ipcMain.handle('get-today-attendance-stats', async (event) => {
  try {
    console.log('IPC: Fetching today\'s attendance statistics');
    const result = await getTodayAttendanceStats();
    return result;
  } catch (error) {
    console.error('IPC: Failed to get today\'s attendance statistics:', error);
    throw error;
  }
});

// Export students to Excel handler
ipcMain.handle('export-students-excel', async (event, students) => {
  try {
    console.log('IPC: Exporting students to Excel');

    // Show save dialog
    const currentDate = new Date().toISOString().split('T')[0];
    const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Save Students Excel File',
      defaultPath: `SAMS_Student_List_Report_${currentDate}.xlsx`,
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, message: 'Export cancelled by user' };
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Add school name
    worksheet.mergeCells('A1:F1');
    const schoolCell = worksheet.getCell('A1');
    schoolCell.value = 'Ampid I Elementary School';
    schoolCell.font = { size: 14, bold: true };
    schoolCell.alignment = { horizontal: 'center' };

    // Add school year
    worksheet.mergeCells('A2:F2');
    const yearCell = worksheet.getCell('A2');
    const currentYear = new Date().getFullYear();
    yearCell.value = `School Year ${currentYear}-${currentYear + 1}`;
    yearCell.font = { size: 12, bold: true };
    yearCell.alignment = { horizontal: 'center' };

    // Add title
    worksheet.mergeCells('A3:F3');
    const titleCell = worksheet.getCell('A3');
    titleCell.value = 'Student List Report';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Add generation info
    worksheet.mergeCells('A4:F4');
    const infoCell = worksheet.getCell('A4');
    infoCell.value = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    infoCell.font = { size: 10, italic: true };
    infoCell.alignment = { horizontal: 'center' };

    // Add empty row
    worksheet.addRow([]);

    // Add headers
    const headers = ['No.', 'LRN', 'Name (Surname, First Name, Middle Name)', 'Grade Level', 'Section', 'RFID'];
    const headerRow = worksheet.addRow(headers);

    // Style headers
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add student data
    students.forEach((student, index) => {
      // Format name as "Surname, First Name, Middle Name"
      const nameParts = [];
      if (student.last_name) nameParts.push(student.last_name);
      if (student.first_name) nameParts.push(student.first_name);
      if (student.middle_name) nameParts.push(student.middle_name);
      if (student.suffix) nameParts.push(student.suffix);

      const formattedName = nameParts.length > 0 ? nameParts.join(', ') : 'N/A';
      const rfidStatus = student.rfid ? student.rfid : 'Not Assigned';

      const row = worksheet.addRow([
        index + 1, // Sequential number starting from 1
        student.lrn || 'N/A',
        formattedName,
        student.grade_level || 'N/A',
        student.section || 'N/A',
        rfidStatus
      ]);

      // Style data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set specific column widths
    worksheet.getColumn(1).width = 5; // "No." column - narrow since it's just numbering
    worksheet.getColumn(2).width = 15; // LRN column
    worksheet.getColumn(3).width = 45; // Name column - needs more space
    worksheet.getColumn(4).width = 14; // Grade Level column
    worksheet.getColumn(5).width = 12; // Section column
    worksheet.getColumn(6).width = 15; // RFID column

    // Write to file
    await workbook.xlsx.writeFile(result.filePath);

    console.log('IPC: Excel export completed successfully');
    return { success: true, message: 'Excel file exported successfully', filePath: result.filePath };

  } catch (error) {
    console.error('IPC: Failed to export students to Excel:', error);
    return { success: false, message: 'Failed to export Excel file: ' + error.message };
  }
});

// Get unique grade levels handler
ipcMain.handle('get-unique-grade-levels', async (event) => {
  try {
    console.log('IPC: Fetching unique grade levels');
    const gradeLevels = await getUniqueGradeLevels();
    return { success: true, gradeLevels };
  } catch (error) {
    console.error('IPC: Failed to get unique grade levels:', error);
    return { success: false, message: error.message };
  }
});

// Get unique sections for a grade level handler
ipcMain.handle('get-unique-sections', async (event, gradeLevel) => {
  try {
    console.log(`IPC: Fetching unique sections for grade level: ${gradeLevel}`);
    const sections = await getUniqueSections(gradeLevel);
    return { success: true, sections };
  } catch (error) {
    console.error('IPC: Failed to get unique sections:', error);
    return { success: false, message: error.message };
  }
});

// Export SF2 attendance handler
ipcMain.handle('export-sf2-attendance', async (event, gradeLevel, section) => {
  try {
    console.log(`IPC: Exporting SF2 attendance for grade level: ${gradeLevel}, section: ${section}`);

    // Get students for the specified grade level and section
    const students = await getStudentsForSF2(gradeLevel, section);

    if (students.length === 0) {
      return { success: false, message: 'No students found for the selected grade level and section' };
    }

    // Path to the source xlsx file (relative to project)
    const sourceFilePath = path.join(__dirname, '../public/assets/sf2.xlsx');

    // Check if source file exists
    if (!fs.existsSync(sourceFilePath)) {
      return { success: false, message: 'Source Excel file not found at: ' + sourceFilePath };
    }

    // Show save dialog
    const currentDate = new Date().toISOString().split('T')[0];
    const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Save SF2 Attendance Excel File',
      defaultPath: `SF2_Attendance_${gradeLevel}_${section}_${currentDate}.xlsx`,
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, message: 'Export cancelled by user' };
    }

    // Load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourceFilePath);
    console.log('✓ File loaded successfully');

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];
    console.log('✓ Worksheet loaded:', worksheet.name);

    // Helper function to convert column number to letter
    function getColumnLetter(col) {
      let letter = '';
      while (col > 0) {
        const remainder = (col - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        col = Math.floor((col - 1) / 26);
      }
      return letter;
    }

    // Metadata information
    const month = new Date().toLocaleString('default', { month: 'long' });
    const schoolId = '104922';
    const schoolName = 'AMPID ELEMENTARY SCHOOL';
    const gradeLevelFormatted = gradeLevel === 'Kindergarten' ? 'KINDER' : gradeLevel.toUpperCase();
    const sectionName = section || '1';

    console.log(`📝 Month: ${month}`);
    console.log(`📝 School ID: ${schoolId}`);
    console.log(`📝 School Name: ${schoolName}`);
    console.log(`📝 Grade Level: ${gradeLevelFormatted}`);
    console.log(`📝 Section Name: ${sectionName}`);
    console.log(`📝 Processing students: ${students.length}`);

    // Set month in AA6
    const cellAA6 = worksheet.getCell('AA6');
    cellAA6.value = month;
    console.log(`✓ Set AA6 (Month) to "${month}"`);

    // Set school ID in G6
    const cellG6 = worksheet.getCell('G6');
    cellG6.value = schoolId;
    console.log(`✓ Set G6 (School ID) to "${schoolId}"`);

    // Set school name in G7
    const cellG7 = worksheet.getCell('G7');
    cellG7.value = schoolName;
    console.log(`✓ Set G7 (School Name) to "${schoolName}"`);

    // Set section name in AA7
    const cellAA7 = worksheet.getCell('AA7');
    cellAA7.value = sectionName;
    console.log(`✓ Set AA7 (Section Name) to "${sectionName}"`);

    // Set grade level in AF7
    const cellAF7 = worksheet.getCell('AF7');
    cellAF7.value = gradeLevelFormatted;
    console.log(`✓ Set AF7 (Grade Level) to "${gradeLevelFormatted}"`);

    console.log('\n📝 Processing students...');

    // Separate students by gender
    const maleStudents = students.filter(student => student.gender === 'Male');
    const femaleStudents = students.filter(student => student.gender === 'Female');

    console.log(`📝 Male students: ${maleStudents.length}`);
    console.log(`📝 Female students: ${femaleStudents.length}`);

    // Process male students (starting at row 13)
    const maleStartRow = 13;
    maleStudents.forEach((student, index) => {
      const targetRow = maleStartRow + index;
      const formattedName = `${student.last_name}, ${student.first_name}, ${student.middle_name || ''}`.trim();

      console.log(`\n--- Processing Male Student ${index + 1} ---`);
      console.log(`  Target row: ${targetRow}`);

      // Set the name in column B
      const cellB = worksheet.getCell(`B${targetRow}`);
      cellB.value = formattedName;
      cellB.alignment = { vertical: 'middle', horizontal: 'left' };
      cellB.font = { size: 11 };

      console.log(`  ✓ Set B${targetRow} value to "${formattedName}"`);
    });

    // Process female students (starting at row 64 in original template)
    const femaleStartRow = 64;
    femaleStudents.forEach((student, index) => {
      const targetRow = femaleStartRow + index;
      const formattedName = `${student.last_name}, ${student.first_name}, ${student.middle_name || ''}`.trim();

      console.log(`\n--- Processing Female Student ${index + 1} ---`);
      console.log(`  Target row: ${targetRow}`);

      // Set the name in column B
      const cellB = worksheet.getCell(`B${targetRow}`);
      cellB.value = formattedName;
      cellB.alignment = { vertical: 'middle', horizontal: 'left' };
      cellB.font = { size: 11 };

      console.log(`  ✓ Set B${targetRow} value to "${formattedName}"`);
    });

    // Convert shared formulas to regular formulas
    console.log('\n🔧 Converting shared formulas to regular formulas...');
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (cell.type === ExcelJS.ValueType.Formula) {
          const cellModel = cell.model;
          if (cellModel.sharedFormula !== undefined) {
            const formula = cell.formula;
            cell.value = { formula: formula };
            console.log(`  Converted cell ${cell.address} from shared to regular formula`);
          }
        }
      });
    });
    console.log('✓ Formula conversion complete');

    // Hide extra male student rows
    if (maleStudents.length < 50) {
      console.log(`\n📝 Male students: ${maleStudents.length}/50, hiding extra rows...`);

      const startHideRow = maleStartRow + maleStudents.length;
      const endHideRow = maleStartRow + 50 - 1;

      console.log(`  Hiding rows ${startHideRow} to ${endHideRow}`);

      for (let r = startHideRow; r <= endHideRow; r++) {
        const row = worksheet.getRow(r);
        row.hidden = true;
      }

      console.log('  ✓ Hidden extra male student rows');
    }

    // Hide extra female student rows
    if (femaleStudents.length < 50) {
      console.log(`\n📝 Female students: ${femaleStudents.length}/50, hiding extra rows...`);

      const startHideRow = femaleStartRow + femaleStudents.length;
      const endHideRow = femaleStartRow + 50 - 1;

      console.log(`  Hiding rows ${startHideRow} to ${endHideRow}`);

      for (let r = startHideRow; r <= endHideRow; r++) {
        const row = worksheet.getRow(r);
        row.hidden = true;
      }

      console.log('  ✓ Hidden extra female student rows');
    }

    // Calculate row positions
    const maleEndRow = maleStartRow + maleStudents.length - 1;
    const maleTotalRow = 63;
    const femaleEndRow = femaleStartRow + femaleStudents.length - 1;
    const femaleTotalRow = 114;
    const combinedTotalRow = 115;

    console.log('\n📊 Row Layout:');
    console.log(`  Male: rows ${maleStartRow}-${maleEndRow}, total at ${maleTotalRow}`);
    console.log(`  Female: rows ${femaleStartRow}-${femaleEndRow}, total at ${femaleTotalRow}`);
    console.log(`  Combined Total: row ${combinedTotalRow}`);

    // Update male total formulas
    console.log(`\n🔧 Updating male total formulas in row ${maleTotalRow}...`);
    console.log(`  Male student range: B${maleStartRow}:B${maleEndRow}`);

    for (let col = 7; col <= 31; col++) {
      const cell = worksheet.getCell(maleTotalRow, col);
      const colLetter = getColumnLetter(col);

      const formula = `IF(${colLetter}10="","",COUNTA($B$${maleStartRow}:$B$${maleEndRow})-(COUNTIF(${colLetter}${maleStartRow}:${colLetter}${maleEndRow},"x")*1 + COUNTIF(${colLetter}${maleStartRow}:${colLetter}${maleEndRow},"h")*0.5))`;

      cell.value = { formula: formula };
      console.log(`  ✓ Updated ${cell.address}: ${formula}`);
    }

    // Update AF and AG for male total (SUM formulas)
    const cellAF_MaleTotal = worksheet.getCell(`AF${maleTotalRow}`);
    cellAF_MaleTotal.value = { formula: `SUM(AF${maleStartRow}:AF${maleEndRow})` };
    console.log(`  ✓ Updated AF${maleTotalRow}: =SUM(AF${maleStartRow}:AF${maleEndRow})`);

    const cellAG_MaleTotal = worksheet.getCell(`AG${maleTotalRow}`);
    cellAG_MaleTotal.value = { formula: `SUM(AG${maleStartRow}:AG${maleEndRow})` };
    console.log(`  ✓ Updated AG${maleTotalRow}: =SUM(AG${maleStartRow}:AG${maleEndRow})`);

    // Update female total formulas
    console.log(`\n🔧 Updating female total formulas in row ${femaleTotalRow}...`);

    if (femaleStudents.length > 0) {
      console.log(`  Female student range: B${femaleStartRow}:B${femaleEndRow}`);

      for (let col = 7; col <= 31; col++) {
        const cell = worksheet.getCell(femaleTotalRow, col);
        const colLetter = getColumnLetter(col);

        const formula = `IF(${colLetter}10="","",COUNTA($B$${femaleStartRow}:$B$${femaleEndRow})-(COUNTIF(${colLetter}${femaleStartRow}:${colLetter}${femaleEndRow},"x")*1 + COUNTIF(${colLetter}${femaleStartRow}:${colLetter}${femaleEndRow},"h")*0.5))`;

        cell.value = { formula: formula };
        console.log(`  ✓ Updated ${cell.address}: ${formula}`);
      }
    } else {
      console.log(`  No female students, setting totals to 0`);

      for (let col = 7; col <= 31; col++) {
        const cell = worksheet.getCell(femaleTotalRow, col);
        cell.value = 0;
        console.log(`  ✓ Set ${cell.address} to 0 (no female students)`);
      }
    }

    // Update AF and AG for female total (SUM formulas)
    if (femaleStudents.length > 0) {
      const cellAF_FemaleTotal = worksheet.getCell(`AF${femaleTotalRow}`);
      cellAF_FemaleTotal.value = { formula: `SUM(AF${femaleStartRow}:AF${femaleEndRow})` };
      console.log(`  ✓ Updated AF${femaleTotalRow}: =SUM(AF${femaleStartRow}:AF${femaleEndRow})`);

      const cellAG_FemaleTotal = worksheet.getCell(`AG${femaleTotalRow}`);
      cellAG_FemaleTotal.value = { formula: `SUM(AG${femaleStartRow}:AG${femaleEndRow})` };
      console.log(`  ✓ Updated AG${femaleTotalRow}: =SUM(AG${femaleStartRow}:AG${femaleEndRow})`);
    } else {
      const cellAF_FemaleTotal = worksheet.getCell(`AF${femaleTotalRow}`);
      cellAF_FemaleTotal.value = 0;
      console.log(`  ✓ Set AF${femaleTotalRow} to 0 (no female students)`);

      const cellAG_FemaleTotal = worksheet.getCell(`AG${femaleTotalRow}`);
      cellAG_FemaleTotal.value = 0;
      console.log(`  ✓ Set AG${femaleTotalRow} to 0 (no female students)`);
    }

    // Update combined total formulas
    console.log(`\n🔧 Updating combined total formulas in row ${combinedTotalRow}...`);

    const cellAF_CombinedTotal = worksheet.getCell(`AF${combinedTotalRow}`);
    cellAF_CombinedTotal.value = { formula: `AF${maleTotalRow}+AF${femaleTotalRow}` };
    console.log(`  ✓ Updated AF${combinedTotalRow}: =AF${maleTotalRow}+AF${femaleTotalRow}`);

    const cellAG_CombinedTotal = worksheet.getCell(`AG${combinedTotalRow}`);
    cellAG_CombinedTotal.value = { formula: `AG${maleTotalRow}+AG${femaleTotalRow}` };
    console.log(`  ✓ Updated AG${combinedTotalRow}: =AG${maleTotalRow}+AG${femaleTotalRow}`);

    // Set student counts
    console.log(`\n🔧 Setting student counts...`);

    const cellAK119 = worksheet.getCell('AK119');
    cellAK119.value = maleStudents.length;
    console.log(`  ✓ Set AK119 (Male count): ${maleStudents.length}`);

    const cellAK120 = worksheet.getCell('AK120');
    cellAK120.value = maleStudents.length;
    console.log(`  ✓ Set AK120 (Male count): ${maleStudents.length}`);

    const cellAL119 = worksheet.getCell('AL119');
    cellAL119.value = femaleStudents.length;
    console.log(`  ✓ Set AL119 (Female count): ${femaleStudents.length}`);

    const cellAL120 = worksheet.getCell('AL120');
    cellAL120.value = femaleStudents.length;
    console.log(`  ✓ Set AL120 (Female count): ${femaleStudents.length}`);

    // **FIX: Update division formulas to handle division by zero**
    console.log(`\n🔧 Updating division formulas to handle zero division...`);

    // AL125: =IF(AL119=0, 0, AL123/AL119)
    const cellAL125 = worksheet.getCell('AL125');
    cellAL125.value = { formula: 'IF(AL119=0, 0, AL123/AL119)' };
    console.log(`  ✓ Updated AL125: =IF(AL119=0, 0, AL123/AL119)`);

    // AL126: =IF(AL119=0, 0, AL123/AL119)
    const cellAL126 = worksheet.getCell('AL126');
    cellAL126.value = { formula: 'IF(AL119=0, 0, AL123/AL119)' };
    console.log(`  ✓ Updated AL126: =IF(AL119=0, 0, AL123/AL119)`);

    // AL128: =IF(AL119=0, 0, AL127/AL123)
    const cellAL128 = worksheet.getCell('AL128');
    cellAL128.value = { formula: 'IF(AL119=0, 0, AL127/AL123)' };
    console.log(`  ✓ Updated AL128: =IF(AL119=0, 0, AL127/AL123)`);

    // AL129: =IF(AL119=0, 0, AL127/AL123)
    const cellAL129 = worksheet.getCell('AL129');
    cellAL129.value = { formula: 'IF(AL119=0, 0, AL127/AL123)' };
    console.log(`  ✓ Updated AL129: =IF(AL119=0, 0, AL127/AL123)`);

    // Save the modified file
    await workbook.xlsx.writeFile(result.filePath);
    console.log('✓ File saved successfully to:', result.filePath);

    console.log('\n✅ SF2 Export completed successfully!');
    return { success: true, message: 'SF2 Attendance Excel file exported successfully', filePath: result.filePath };

  } catch (error) {
    console.error('IPC: Failed to export SF2 attendance:', error);
    return { success: false, message: 'Failed to export SF2 file: ' + error.message };
  }
});

// Export logs handler - copies sf2.xlsx to user-selected location
ipcMain.handle('export-logs-excel', async (event) => {
  try {
    console.log('IPC: Exporting logs to Excel');

    // Path to the source xlsx file (relative to project)
    const sourceFilePath = path.join(__dirname, '../public/assets/sf2.xlsx');

    // Check if source file exists
    if (!fs.existsSync(sourceFilePath)) {
      return { success: false, message: 'Source Excel file not found at: ' + sourceFilePath };
    }

    // Show save dialog
    const currentDate = new Date().toISOString().split('T')[0];
    const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Save Logs Excel File',
      defaultPath: `SAMS_Logs_Report_${currentDate}.xlsx`,
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, message: 'Export cancelled by user' };
    }

    // Load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourceFilePath);

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];

    // Insert a new row at position 57 (below row 56)
    worksheet.insertRow(57, []);

    // Get data from row 56 and copy to the new row 57
    const row56 = worksheet.getRow(56);
    const row57 = worksheet.getRow(57);

    row56.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const newCell = row57.getCell(colNumber);
      // Copy only the style (borders, etc.), not the value
      newCell.style = cell.style;
    });

    row57.commit();

    // Unmerge cells in row 57 first (in case they're already merged from the insert)
    try {
      worksheet.unMergeCells(`A57:B57`);
    } catch (e) { /* ignore if not merged */ }
    try {
      worksheet.unMergeCells(`F57:G57`);
    } catch (e) { /* ignore if not merged */ }

    // Merge cells in row 57: A-B and F-G (matching row 56)
    worksheet.mergeCells(`A57:B57`);
    worksheet.mergeCells(`F57:G57`);

    // Clear all values in row 57 (keep only borders and merged cells)
    row57.eachCell({ includeEmpty: true }, (cell) => {
      cell.value = null;
    });
    row57.commit();

    // Get value from A56 and increment by 1 for A57
    const cellA56 = worksheet.getCell('A56');
    const valueA56 = cellA56.value;
    let newValue = 1; // Default value

    if (valueA56 !== null && valueA56 !== undefined) {
      // If it's a number, increment it
      if (typeof valueA56 === 'number') {
        newValue = valueA56 + 1;
      } else if (typeof valueA56 === 'string' && !isNaN(parseFloat(valueA56))) {
        newValue = parseFloat(valueA56) + 1;
      }
    }

    // Set the incremented value in A57 with formatting
    const cellA57 = worksheet.getCell('A57');
    cellA57.value = newValue;
    cellA57.alignment = { vertical: 'middle', horizontal: 'center' };
    cellA57.font = { size: 7 };

    // Save the modified file to the selected location
    await workbook.xlsx.writeFile(result.filePath);

    console.log('IPC: Logs Excel export completed successfully with row inserted at position 56');
    return { success: true, message: 'Excel file exported successfully', filePath: result.filePath };

  } catch (error) {
    console.error('IPC: Failed to export logs to Excel:', error);
    return { success: false, message: 'Failed to export Excel file: ' + error.message };
  }
});

// Main process initialized