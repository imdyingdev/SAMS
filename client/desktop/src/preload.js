const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose protected methods that allow the renderer process to use
 * the ipcRenderer without exposing the entire object
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // System and Auth
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  getVersion: () => ipcRenderer.invoke('system:get-version'),
  getUserRole: (userId) => ipcRenderer.invoke('auth:get-user-role', userId),
  updateUserRole: (userId, newRole) => ipcRenderer.invoke('auth:update-user-role', userId, newRole),

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
  createStudent: (studentData) => ipcRenderer.invoke('create-student', studentData),
  saveStudent: (studentData) => ipcRenderer.invoke('save-student', studentData),
  getAllStudents: () => ipcRenderer.invoke('get-all-students'),
  getStudentsPaginated: (page, pageSize, searchTerm, gradeFilter, rfidFilter, sectionFilter) => 
    ipcRenderer.invoke('get-students-paginated', page, pageSize, searchTerm, gradeFilter, rfidFilter, sectionFilter),
  deleteStudent: (studentId) => ipcRenderer.invoke('delete-student', studentId),
  updateStudent: (studentId, studentData) => ipcRenderer.invoke('update-student', { studentId, studentData }),
  getStudentById: (studentId) => ipcRenderer.invoke('get-student-by-id', studentId),
  getStudentStatsByGrade: () => ipcRenderer.invoke('get-student-stats-by-grade'),
  getStudentStatsByGender: () => ipcRenderer.invoke('get-student-stats-by-gender'),
  checkSF1Duplicates: (fileBuffer) => ipcRenderer.invoke('check-sf1-duplicates', fileBuffer),
  importSF1File: (fileBuffer, nameConflicts) => ipcRenderer.invoke('import-sf1-file', fileBuffer, nameConflicts),

  // Logs Data
  getLogsPaginated: (page, pageSize, searchTerm, logTypeFilter, dateFilter) =>
    ipcRenderer.invoke('get-logs-paginated', page, pageSize, searchTerm, logTypeFilter, dateFilter),
  getRecentLogs: (limit) => ipcRenderer.invoke('get-recent-logs', limit),
  createLogEntry: (logType, description, rfid, studentId, details) =>
    ipcRenderer.invoke('create-log-entry', logType, description, rfid, studentId, details),
  deleteLogEntry: (logId) => ipcRenderer.invoke('delete-log-entry', logId),
    
  // Announcements Data
  createAnnouncement: (announcementData) => ipcRenderer.invoke('create-announcement', announcementData),
  getAllAnnouncements: (limit, offset) => ipcRenderer.invoke('get-all-announcements', limit, offset),
  getAnnouncementsCount: () => ipcRenderer.invoke('get-announcements-count'),
  getAnnouncementById: (id) => ipcRenderer.invoke('get-announcement-by-id', id),
  updateAnnouncement: (id, announcementData) => ipcRenderer.invoke('update-announcement', { id, announcementData }),
  deleteAnnouncement: (id) => ipcRenderer.invoke('delete-announcement', id),
  searchAnnouncements: (searchTerm, limit, offset) => ipcRenderer.invoke('search-announcements', searchTerm, limit, offset),

  // Attendance Statistics
  getTodayAttendanceStats: () => ipcRenderer.invoke('get-today-attendance-stats'),
  getWeeklyAttendanceStats: () => ipcRenderer.invoke('get-weekly-attendance-stats'),

  // Export functionality
  exportStudentsExcel: (students) => ipcRenderer.invoke('export-students-excel', students),
  exportLogsExcel: (dateFilter, gradeFilter, sectionFilter) => ipcRenderer.invoke('export-logs-excel', dateFilter, gradeFilter, sectionFilter),
  getLogsExportFilters: (dateFilter) => ipcRenderer.invoke('get-logs-export-filters', dateFilter),
  getUniqueGradeLevels: () => ipcRenderer.invoke('get-unique-grade-levels'),
  getUniqueSections: (gradeLevel) => ipcRenderer.invoke('get-unique-sections', gradeLevel),
  getAllUniqueSections: () => ipcRenderer.invoke('get-all-unique-sections'),
  exportSF2Attendance: (gradeLevel, section, lrnPrefix) => ipcRenderer.invoke('export-sf2-attendance', gradeLevel, section, lrnPrefix),

  // Grade Sections Management
  getAllGradeSections: () => ipcRenderer.invoke('get-all-grade-sections'),
  addSection: (gradeLevel, sectionName) => ipcRenderer.invoke('add-section', gradeLevel, sectionName),
  updateSection: (sectionId, newSectionName) => ipcRenderer.invoke('update-section', sectionId, newSectionName),
  deleteSection: (sectionId) => ipcRenderer.invoke('delete-section', sectionId),
  addGradeLevel: (gradeLevel, initialSection) => ipcRenderer.invoke('add-grade-level', gradeLevel, initialSection),

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