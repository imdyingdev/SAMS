const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose protected methods that allow the renderer process to use
 * the ipcRenderer without exposing the entire object
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // System and Auth
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  getVersion: () => ipcRenderer.invoke('system:get-version'),

  // Navigation
  gotoDashboard: () => ipcRenderer.invoke('nav:navigate-to', 'dashboard'),
  gotoLogin: () => ipcRenderer.send('logout'),
  navigateTo: (page) => ipcRenderer.invoke('nav:navigate-to', page),
  logout: () => ipcRenderer.send('logout'),

  // Listen for window state changes from main process
  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', (_event, value) => callback(value)),

  // Window controls - Reset and clean implementation
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  toggleMaximize: () => ipcRenderer.invoke('window:maximize'),
  toggleFullscreen: () => ipcRenderer.send('window:toggle-fullscreen'),
  openDevTools: () => ipcRenderer.send('window:open-devtools'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Student Data
  saveStudent: (studentData) => ipcRenderer.invoke('save-student', studentData),
  getAllStudents: () => ipcRenderer.invoke('get-all-students'),
  getStudentsPaginated: (page, pageSize, searchTerm, gradeFilter, rfidFilter) => 
    ipcRenderer.invoke('get-students-paginated', page, pageSize, searchTerm, gradeFilter, rfidFilter),
  deleteStudent: (studentId) => ipcRenderer.invoke('delete-student', studentId),
  updateStudent: (studentId, studentData) => ipcRenderer.invoke('update-student', { studentId, studentData }),
  getStudentById: (studentId) => ipcRenderer.invoke('get-student-by-id', studentId),
  getStudentStatsByGrade: () => ipcRenderer.invoke('get-student-stats-by-grade'),
  getStudentStatsByGender: () => ipcRenderer.invoke('get-student-stats-by-gender'),

  // Logs Data
  getLogsPaginated: (page, pageSize, searchTerm, logTypeFilter, dateFilter) => 
    ipcRenderer.invoke('get-logs-paginated', page, pageSize, searchTerm, logTypeFilter, dateFilter),
  getRecentLogs: (limit) => ipcRenderer.invoke('get-recent-logs', limit),
  createLogEntry: (logType, description, rfid, studentId, details) => 
    ipcRenderer.invoke('create-log-entry', logType, description, rfid, studentId, details),

  // RFID Scanning
  startRfidScan: () => ipcRenderer.send('rfid:start-scan'),
  stopRfidScan: () => ipcRenderer.send('rfid:stop-scan'),
  onRfidScan: (callback) => {
    const subscription = (event, rfid) => callback(rfid);
    ipcRenderer.on('rfid:scan-success', subscription);
    return () => {
      ipcRenderer.removeListener('rfid:scan-success', subscription);
    };
  },
});

/**
 * Expose a limited API for debugging in development
 */
if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('devAPI', {
    log: (message) => console.log('🐛 Renderer:', message),
    error: (message) => console.error('❌ Renderer:', message),
  });
}