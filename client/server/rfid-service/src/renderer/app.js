// Renderer process - RFID Scanner application logic
const displayText = document.getElementById('display-text');
let dotsSpan = document.getElementById('dots');
const scanLogDiv = document.getElementById('scan-log');
let currentRfid = '';
let scanLog = [];
let dotCount = 0;
let animationInterval;
let rfidCounts = {};
let rfidTimestamps = {}; // Track timestamp of first tap
let pendingRfid = '';
const TIME_WINDOW_MS = 60000; // 1 minute (change to 1800000 for 30 minutes)
let isWindowFocused = true;

// Listen for window focus changes
let previousDisplayText = '';
window.rfidAPI.onFocusChanged((isFocused) => {  
    
    isWindowFocused = isFocused;
    const rfidDisplay = document.querySelector('.rfid-display');
    
    if (!isFocused) {
        // Add unfocused class for dark background
        rfidDisplay.classList.add('unfocused');
        
        // Save current display text and always show focus message
        previousDisplayText = displayText.textContent;
        stopDotAnimation();
        displayText.textContent = 'Click here to focus before scanning...';
        dotsSpan.textContent = '';
    } else {
        // Remove unfocused class
        rfidDisplay.classList.remove('unfocused');
        
        // Restore to ready state when regaining focus
        displayText.textContent = 'Ready for RFID Scan';
        dotsSpan.textContent = '.';
        startDotAnimation();
    }
});

// Start dot animation immediately
startDotAnimation();

// Load today's RFID state from database
async function loadTodayRfidState() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const logs = await window.rfidAPI.getRecentLogs(1000); // Get more logs to capture today's data
        
        // Filter for today's logs only
        const todayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            return logDate === today;
        });
        
        // Group by RFID to get the latest state
        const rfidStates = {};
        
        todayLogs.forEach(log => {
            if (!rfidStates[log.rfid]) {
                rfidStates[log.rfid] = {
                    count: 0,
                    firstTimestamp: null
                };
            }
            
            // Count taps for each RFID
            if (log.tap_type === 'time_in') {
                rfidStates[log.rfid].count = Math.max(rfidStates[log.rfid].count, 1);
                rfidStates[log.rfid].firstTimestamp = new Date(log.timestamp).getTime();
            } else if (log.tap_type === 'time_out') {
                rfidStates[log.rfid].count = Math.max(rfidStates[log.rfid].count, 2);
            }
        });
        
        // Populate rfidCounts and rfidTimestamps
        Object.keys(rfidStates).forEach(rfid => {
            rfidCounts[rfid] = rfidStates[rfid].count;
            if (rfidStates[rfid].firstTimestamp) {
                rfidTimestamps[rfid] = rfidStates[rfid].firstTimestamp;
            }
        });
        
        console.log('Loaded today\'s RFID state:', rfidCounts);
        
        // Load recent logs for display (last 3, most recent first)
        const sortedLogs = todayLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentLogs = sortedLogs.slice(0, 3);
        
        // Clear existing scanLog
        scanLog = [];
        
        // Fetch student info for each log
        for (const log of recentLogs) {
            const student = await window.rfidAPI.getStudentByRfid(log.rfid);
            scanLog.push({
                rfid: log.rfid,
                studentName: student ? `${student.first_name} ${student.last_name}` : null,
                gradeLevel: student ? student.grade_level : null,
                timestamp: log.timestamp,
                count: log.tap_count
            });
        }
        
        // Update the scan log display
        updateScanLog();
        
    } catch (error) {
        console.error('Error loading today\'s RFID state:', error);
    }
}

// Load state when app starts
loadTodayRfidState();

function startDotAnimation() {
    // Only start animation if window is focused
    if (!isWindowFocused) {
        return;
    }
    
    dotCount = 1;
    if (dotsSpan) {
        dotsSpan.textContent = '.'.repeat(dotCount);
    }
    animationInterval = setInterval(() => {
        // Double check window focus during animation
        if (!isWindowFocused) {
            stopDotAnimation();
            if (dotsSpan) {
                dotsSpan.textContent = '';
            }
            return;
        }
        
        dotCount = (dotCount % 3) + 1;
        if (dotsSpan) {
            dotsSpan.textContent = '.'.repeat(dotCount);
        }
    }, 500);
}

function stopDotAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    // Ensure dots are cleared when animation stops
    if (dotsSpan) {
        dotsSpan.textContent = '';
    }
}

// Main RFID scan handler - logs to database (validation already done)
async function handleRfidScan(rfid, tapCount) {
    try {
        // Log to database (RFID already validated)
        const result = await window.rfidAPI.validateAndLogRfid(rfid, tapCount);

        // Success - update UI
        const studentName = result.student.first_name + ' ' + result.student.last_name;
        const timestamp = new Date();
        const scanEntry = {
            rfid: rfid,
            studentName: studentName,
            gradeLevel: result.student.grade_level,
            timestamp: timestamp.toISOString(),
            count: tapCount
        };

        scanLog.unshift(scanEntry);

        if (scanLog.length > 3) {
            scanLog = scanLog.slice(0, 3);
        }

        stopDotAnimation();
        displayText.textContent = `✓ ${studentName}`;
        dotsSpan.textContent = '';
        updateScanLog();

        setTimeout(() => {
            displayText.textContent = 'Ready for RFID Scan';
            dotsSpan.textContent = '.';
            startDotAnimation();
        }, 2000);

    } catch (error) {
        console.error('Error handling RFID scan:', error);
        stopDotAnimation();
        displayText.textContent = `✗ Error: ${error.message}`;
        dotsSpan.textContent = '';
        
        setTimeout(() => {
            displayText.textContent = 'Ready for RFID Scan';
            dotsSpan.textContent = '.';
            startDotAnimation();
        }, 3000);
    }
}

document.addEventListener('keypress', function(e) {
    // Auto-hide How overlay if it's showing
    if (isHowOverlayVisible) {
        toggleHowOverlay();
    }
    
    // Block RFID processing when modal is open or window not focused
    const modal = document.getElementById('confirmModal');
    if (modal.style.display === 'flex' || !isWindowFocused) {
        return;
    }
    
    if (e.key === 'Enter') {
        if (currentRfid) {
            setTimeout(async () => {
                const rfidToProcess = currentRfid;
                currentRfid = '';
                
                // First, check if RFID exists in database
                const student = await window.rfidAPI.getStudentByRfid(rfidToProcess);
                
                if (!student) {
                    // RFID not found - show error, don't track taps
                    stopDotAnimation();
                    displayText.textContent = `✗ ${rfidToProcess} - Not Found`;
                    dotsSpan.textContent = '';
                    
                    setTimeout(() => {
                        displayText.textContent = 'Ready for RFID Scan';
                        dotsSpan.textContent = '.';
                        startDotAnimation();
                    }, 3000);
                    return;
                }
                
                // RFID exists - proceed with tap counting
                const now = new Date().getTime();
                
                if (!rfidCounts[rfidToProcess]) {
                    rfidCounts[rfidToProcess] = 0;
                }
                
                rfidCounts[rfidToProcess]++;

                if (rfidCounts[rfidToProcess] === 1) {
                    // First tap - record timestamp
                    rfidTimestamps[rfidToProcess] = now;
                    await handleRfidScan(rfidToProcess, 1);
                } else if (rfidCounts[rfidToProcess] === 2) {
                    // Check if second tap is within time window
                    const timeSinceFirstTap = now - rfidTimestamps[rfidToProcess];
                    
                    if (timeSinceFirstTap <= TIME_WINDOW_MS) {
                        // Within time window - show modal
                        pendingRfid = rfidToProcess;
                        const modal = document.getElementById('confirmModal');
                        modal.style.display = 'flex';
                        return;
                    }
                    // Outside time window - don't show modal, but still count as second tap (red)
                    await handleRfidScan(rfidToProcess, 2);
                } else {
                    stopDotAnimation();
                    displayText.textContent = `✗ ${rfidToProcess}`;
                    dotsSpan.textContent = '';
                    
                    setTimeout(() => {
                        displayText.textContent = 'Ready for RFID Scan';
                        dotsSpan.textContent = '.';
                        startDotAnimation();
                    }, 2000);
                }
            }, 150);
        }
    } else {
        currentRfid += e.key;
        stopDotAnimation();
        displayText.textContent = currentRfid;
        dotsSpan.textContent = '';
    }
});

document.getElementById('yesBtn').addEventListener('click', async function() {
    document.getElementById('confirmModal').style.display = 'none';
    const rfid = pendingRfid;
    pendingRfid = '';

    await handleRfidScan(rfid, 2);
});

document.getElementById('noBtn').addEventListener('click', function() {
    document.getElementById('confirmModal').style.display = 'none';
    rfidCounts[pendingRfid]--;
    pendingRfid = '';

    stopDotAnimation();
    displayText.textContent = 'Cancelled';
    dotsSpan.textContent = '';

    setTimeout(() => {
        displayText.textContent = 'Ready for RFID Scan';
        dotsSpan.textContent = '.';
        startDotAnimation();
    }, 2000);
});

function updateScanLog() {
    const totalUnique = Object.keys(rfidCounts).length;

    scanLogDiv.innerHTML = `<div class="scan-counter">Total Student: ${totalUnique}</div>` + scanLog.map((scan) => {
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
}

// How button and overlay handler
const howBtn = document.getElementById('howBtn');
const howOverlay = document.getElementById('howOverlay');
let isHowOverlayVisible = false;

// Only respond to actual mouse clicks, not keyboard events (which RFID scanners use)
howBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleHowOverlay();
});

// Prevent keyboard events from triggering the button
howBtn.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

howBtn.addEventListener('keypress', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

howOverlay.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleHowOverlay();
});

// Export button handler
const exportBtn = document.getElementById('exportBtn');

exportBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add export functionality
    console.log('Export button clicked');
});

exportBtn.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

exportBtn.addEventListener('keypress', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

// Settings button handler
const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add settings functionality
    console.log('Settings button clicked');
});

settingsBtn.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

settingsBtn.addEventListener('keypress', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

function toggleHowOverlay() {
    isHowOverlayVisible = !isHowOverlayVisible;
    
    if (isHowOverlayVisible) {
        howOverlay.style.display = 'flex';
        // Trigger reflow to ensure animation works
        howOverlay.offsetHeight;
        howOverlay.classList.add('show');
    } else {
        howOverlay.classList.remove('show');
        setTimeout(() => {
            howOverlay.style.display = 'none';
        }, 600); // Match transition duration
    }
}
