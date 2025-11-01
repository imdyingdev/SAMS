// Dashboard Attendance Module

// Function to load today's attendance statistics
export async function loadTodayAttendanceStats() {
    console.log('Loading today\'s attendance statistics...');
    
    // Get the stat elements
    const timeInCount = document.getElementById('time-in-count');
    const timeOutCount = document.getElementById('time-out-count');
    
    if (!timeInCount || !timeOutCount) {
        console.error('Attendance stat elements not found');
        return;
    }
    
    try {
        // Check if electronAPI is available
        if (!window.electronAPI || typeof window.electronAPI.getTodayAttendanceStats !== 'function') {
            console.warn('Electron API not available for attendance stats. Using mock data.');
            
            // Use mock data for testing
            const mockTimeIn = Math.floor(Math.random() * 50) + 20; // Random number between 20-70
            const mockTimeOut = Math.floor(Math.random() * mockTimeIn);
            
            // Update the UI with mock data
            timeInCount.textContent = mockTimeIn;
            timeOutCount.textContent = mockTimeOut;
            
            return;
        }
        
        // Use actual API if available
        const result = await window.electronAPI.getTodayAttendanceStats();
        console.log('Attendance stats result:', result);
        
        if (result && result.success && result.data) {
            // Update the UI with real data
            timeInCount.textContent = result.data.timeIn || '0';
            timeOutCount.textContent = result.data.timeOut || '0';
            console.log(`Updated attendance stats: Time In: ${result.data.timeIn}, Time Out: ${result.data.timeOut}`);
        } else {
            console.error('Invalid attendance statistics response:', result);
            throw new Error('Failed to load attendance statistics');
        }
    } catch (error) {
        console.error('Error loading attendance statistics:', error);
        
        // Set default values on error
        timeInCount.textContent = '--';
        timeOutCount.textContent = '--';
    }
}

// Initialize when the module is loaded
export function initializeDashboardAttendance() {
    // Load attendance statistics
    loadTodayAttendanceStats();
    
    // Refresh stats every 5 minutes
    setInterval(() => {
        loadTodayAttendanceStats();
    }, 300000); // 5 minutes
}
