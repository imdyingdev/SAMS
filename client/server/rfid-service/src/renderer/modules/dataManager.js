// Data Management Module - Database queries and UI updates
export class DataManager {
    constructor() {
        this.scanLogDiv = document.getElementById('scan-log');
        this.gradeCountersVisible = false;
        this.pollingStarted = false; // Track if polling has started
    }

    // Initialize data manager
    init() {
        this.setupRealtimeListener();
        this.setupPollingFallback(); // Add polling fallback listener
        this.loadDisplayData();
        // Removed periodic refresh - relying on realtime updates
        // this.startPeriodicRefresh();
        
        // Optional: Keep a fallback refresh mechanism for error recovery
        this.setupFallbackRefresh();
    }

    // Setup real-time log changes listener
    setupRealtimeListener() {
        window.rfidAPI.onLogChange((changeData) => {
            const rendererReceiveTime = new Date();
            const changeTimestamp = changeData.timestamp;
            const rendererDelay = changeTimestamp ? (rendererReceiveTime - new Date(changeTimestamp)) : 'unknown';
            
            console.log('Real-time log change received in renderer:', {
                eventType: changeData.eventType,
                changeTimestamp: changeTimestamp,
                rendererReceiveTime: rendererReceiveTime.toISOString(),
                rendererDelay: typeof rendererDelay === 'number' ? `${rendererDelay.toFixed(2)}ms` : rendererDelay
            });
            
            // Process all events immediately without delay
            switch (changeData.eventType) {
                case 'INSERT':
                    console.log('INSERT detected - immediate refresh...');
                    this.loadDisplayData();
                    this.updateLastRefreshTime();
                    break;
                case 'UPDATE':
                    console.log('UPDATE detected - immediate refresh...');
                    this.loadDisplayData();
                    this.updateLastRefreshTime();
                    break;
                case 'DELETE':
                    console.log('DELETE detected - immediate refresh...');
                    this.loadDisplayData();
                    this.updateLastRefreshTime();
                    break;
                default:
                    console.log('Unknown event type - immediate refresh...');
                    this.loadDisplayData();
                    this.updateLastRefreshTime();
            }
        });
    }

    // Setup polling fallback listener
    setupPollingFallback() {
        // Listen for immediate refresh signals from main process (after successful RFID log)
        window.rfidAPI.onImmediateRefresh((data) => {
            if (data.rfid) {
                console.log('Immediate refresh after RFID scan:', data.rfid);
            } else if (data.reason === 'window-focus') {
                console.log('Immediate refresh on window focus');
            } else {
                console.log('Immediate refresh triggered');
            }
            this.loadDisplayData();
            this.updateLastRefreshTime();
        });
        
        // Listen for polling refresh signals from main process (fallback when realtime fails)
        window.rfidAPI.onPollingRefresh((data) => {
            // Only log first polling message to reduce console noise
            if (!this.pollingStarted) {
                console.log('Polling refresh active (2-second interval when focused)');
                this.pollingStarted = true;
            }
            this.loadDisplayData();
            this.updateLastRefreshTime();
        });
    }

    // Load display data from database (fully database-driven)
    async loadDisplayData() {
        const startTime = performance.now();
        try {
            console.log('Loading display data from database...');
            
            // Get grade level counts from database
            const gradeData = await window.rfidAPI.getTodayGradeLevelCounts();
            const gradeDataTime = performance.now();
            console.log(`Grade data fetched in ${(gradeDataTime - startTime).toFixed(2)}ms`);
            
            // Get recent logs from database  
            const recentLogs = await window.rfidAPI.getRecentLogsWithStudentInfo(3);
            const logsTime = performance.now();
            console.log(`Logs fetched in ${(logsTime - gradeDataTime).toFixed(2)}ms`);
            
            // Update display with fresh database data
            this.updateScanLog(gradeData.gradeLevelCounts, gradeData.gradeLevelOrder, recentLogs);
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
            const totalTime = performance.now() - startTime;
            console.log(`Display data loaded successfully in ${totalTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('Error loading display data:', error);
        }
    }

    // Update scan log display
    updateScanLog(gradeLevelCounts = {}, gradeLevelOrder = [], scanLog = []) {
        // Calculate totals from database-provided grade level counts
        let totalTimeIn = 0;
        let totalTimeOut = 0;
        
        Object.values(gradeLevelCounts).forEach(counts => {
            totalTimeIn += counts.timeIn;
            totalTimeOut += counts.timeOut;
        });
        
        // Build counter display with separate containers
        let counterDisplay = '<div class="counters-container">';
        
        // Total Students counter in its own container
        counterDisplay += '<div class="scan-counter total-counter">';
        if (totalTimeOut > 0) {
            counterDisplay += `Total Students: <span class="time-out-count">${totalTimeOut}</span>/<span class="time-in-count">${totalTimeIn}</span>`;
        } else if (totalTimeIn > 0) {
            counterDisplay += `Total Students: <span class="time-in-count">${totalTimeIn}</span>`;
        } else {
            counterDisplay += 'Total Students: 0';
        }
        counterDisplay += '</div>';
        
        // Grade level counters (in order of most recent activity) - each in its own container
        gradeLevelOrder.forEach(gradeLevel => {
            const counts = gradeLevelCounts[gradeLevel];
            if (counts) {
                // Apply hidden class if grade counters should be hidden
                const hiddenClass = this.gradeCountersVisible ? '' : ' hidden';
                counterDisplay += `<div class="scan-counter grade-counter${hiddenClass}">`;
                if (counts.timeOut > 0) {
                    counterDisplay += `${gradeLevel}: <span class="time-out-count">${counts.timeOut}</span>/<span class="time-in-count">${counts.timeIn}</span>`;
                } else if (counts.timeIn > 0) {
                    counterDisplay += `${gradeLevel}: <span class="time-in-count">${counts.timeIn}</span>`;
                }
                counterDisplay += '</div>';
            }
        });
        
        counterDisplay += '</div>';

        this.scanLogDiv.innerHTML = counterDisplay + scanLog.map((scan) => {
            const date = new Date(scan.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const dateStr = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const statusClass = scan.count === 1 ? 'first' : 'second';
            const studentInfo = scan.studentName ? `${scan.studentName} (${scan.gradeLevel})` : scan.rfid;
            return `<div class="scan-entry">
                <div class="status-indicator ${statusClass}"></div>
                <div class="entry-content">
                    <span class="rfid">${studentInfo}</span>
                    <span class="timestamp">${dateStr} ${timeStr}</span>
                </div>
            </div>`;
        }).join('');
        
        // Attach click event to total counter for toggling grade counters
        this.attachTotalCounterToggle();
    }

    // Toggle grade counters visibility
    toggleGradeCounters() {
        this.gradeCountersVisible = !this.gradeCountersVisible;
        const gradeCounters = document.querySelectorAll('.grade-counter');
        
        gradeCounters.forEach(counter => {
            if (this.gradeCountersVisible) {
                counter.classList.remove('hidden');
            } else {
                counter.classList.add('hidden');
            }
        });
    }

    // Attach click event listener to total counter
    attachTotalCounterToggle() {
        const totalCounter = document.querySelector('.total-counter');
        if (totalCounter) {
            // Remove any existing listener
            totalCounter.replaceWith(totalCounter.cloneNode(true));
            
            // Attach new listener
            const newTotalCounter = document.querySelector('.total-counter');
            newTotalCounter.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleGradeCounters();
            });
            
            // Prevent keyboard events
            newTotalCounter.addEventListener('keydown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            newTotalCounter.addEventListener('keypress', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            // Add cursor pointer style
            newTotalCounter.style.cursor = 'pointer';
        }
    }

    // Setup fallback refresh mechanism (only for error recovery)
    setupFallbackRefresh() {
        // Track last update time
        this.lastUpdateTime = Date.now();
        
        // Check every 30 seconds if we haven't received updates in a while
        setInterval(() => {
            const timeSinceLastUpdate = Date.now() - this.lastUpdateTime;
            const FALLBACK_THRESHOLD = 60000; // 1 minute
            
            if (timeSinceLastUpdate > FALLBACK_THRESHOLD) {
                console.log('No realtime updates for 1 minute - running fallback refresh...');
                this.loadDisplayData();
            }
        }, 30000); // Check every 30 seconds
    }
    
    // Update last refresh time (call this whenever data is refreshed)
    updateLastRefreshTime() {
        this.lastUpdateTime = Date.now();
    }

    // Refresh data immediately
    refreshData() {
        setTimeout(() => this.loadDisplayData(), 200);
    }
}
