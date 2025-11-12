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
let gradeLevelCounts = {}; // Track counts by grade level {gradeLevel: {timeIn: count, timeOut: count}}
let gradeLevelOrder = []; // Track order of grade levels for display
let gradeCountersVisible = false; // Track visibility state of grade counters (default hidden)

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
        displayText.innerHTML = 'Click here to focus<br>before tap a card...';
        dotsSpan.textContent = '';
    } else {
        // Remove unfocused class
        rfidDisplay.classList.remove('unfocused');
        
        // Restore to ready state when regaining focus
        displayText.textContent = 'Ready for RFID Tap';
        dotsSpan.textContent = '.';
        startDotAnimation();
    }
});

// Listen for real-time log changes (backup only - main system uses direct DB checks)
window.rfidAPI.onLogChange((changeData) => {
    console.log('📡 Real-time log change received (backup trigger):', changeData.eventType);
    
    // Just trigger a quick refresh - don't rely on this for critical functionality
    if (changeData.eventType === 'DELETE') {
        console.log('🗑️ DELETE detected - triggering quick refresh...');
        setTimeout(() => {
            loadTodayRfidState();
        }, 100);
    }
});

// Start dot animation immediately
startDotAnimation();

// Load today's RFID state from database
async function loadTodayRfidState() {
    try {
        console.log('🔄 Loading today\'s RFID state from database...');
        
        const today = new Date().toISOString().split('T')[0];
        
        const logs = await window.rfidAPI.getRecentLogs(1000); // Get more logs to capture today's data
        
        // Filter for today's logs only
        const todayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            return logDate === today;
        });
        
        console.log(`📊 Found ${todayLogs.length} logs for today`);
        
        // Clear existing state first
        rfidCounts = {};
        rfidTimestamps = {};
        gradeLevelCounts = {};
        gradeLevelOrder = [];
        
        // Group by RFID to get the latest state
        const rfidStates = {};
        
        todayLogs.forEach(log => {
            if (!rfidStates[log.rfid]) {
                rfidStates[log.rfid] = {
                    count: 0,
                    firstTimestamp: null,
                    logs: []
                };
            }
            
            rfidStates[log.rfid].logs.push(log);
        });
        
        // Process each RFID's logs in chronological order
        for (const rfid of Object.keys(rfidStates)) {
            const logs = rfidStates[rfid].logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            let count = 0;
            let firstTimestamp = null;
            
            // Get student info for grade level
            const student = await window.rfidAPI.getStudentByRfid(rfid);
            const gradeLevel = student ? student.grade_sections.grade_level : null;
            
            logs.forEach(log => {
                if (log.tap_type === 'time_in') {
                    count = Math.max(count, 1);
                    if (!firstTimestamp) {
                        firstTimestamp = new Date(log.timestamp).getTime();
                    }
                } else if (log.tap_type === 'time_out') {
                    count = Math.max(count, 2);
                }
            });
            
            rfidCounts[rfid] = count;
            if (firstTimestamp) {
                rfidTimestamps[rfid] = firstTimestamp;
            }
            
            // Update grade level counts
            if (gradeLevel && count > 0) {
                if (!gradeLevelCounts[gradeLevel]) {
                    gradeLevelCounts[gradeLevel] = { timeIn: 0, timeOut: 0 };
                }
                
                if (count === 1) {
                    gradeLevelCounts[gradeLevel].timeIn++;
                } else if (count === 2) {
                    gradeLevelCounts[gradeLevel].timeIn++;
                    gradeLevelCounts[gradeLevel].timeOut++;
                }
                
                // Update grade level order (most recent activity first)
                const index = gradeLevelOrder.indexOf(gradeLevel);
                if (index > -1) {
                    gradeLevelOrder.splice(index, 1);
                }
                gradeLevelOrder.unshift(gradeLevel);
            }
        }
        
        console.log('📋 Updated RFID counts:', rfidCounts);
        console.log('⏰ Updated RFID timestamps:', Object.keys(rfidTimestamps).length);
        
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
                gradeLevel: student ? student.grade_sections.grade_level : null,
                timestamp: log.timestamp,
                count: log.tap_count
            });
        }
        
        // Update the scan log display
        updateScanLog();
        
        console.log('✅ RFID state loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading today\'s RFID state:', error);
    }
}

// Load state when app starts
loadTodayRfidState();

// Reduce periodic refresh to every 5 seconds for better responsiveness
setInterval(() => {
    console.log('🔄 Quick periodic refresh...');
    loadTodayRfidState();
}, 5000);

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

// Main RFID scan handler - checks database directly for current state
async function handleRfidScan(rfid, tapCount) {
    try {
        // Always check current database state before processing
        console.log(`🔍 Checking current database state for RFID: ${rfid}`);
        await refreshRfidState(rfid);
        
        // Log to database (RFID already validated)
        const result = await window.rfidAPI.validateAndLogRfid(rfid, tapCount);

        // Success - update UI
        const studentName = result.student.first_name + ' ' + result.student.last_name;
        const gradeLevel = result.student.grade_sections.grade_level;
        const timestamp = new Date();
        const scanEntry = {
            rfid: rfid,
            studentName: studentName,
            gradeLevel: gradeLevel,
            timestamp: timestamp.toISOString(),
            count: tapCount
        };
        
        // Update grade level counts
        if (gradeLevel) {
            if (!gradeLevelCounts[gradeLevel]) {
                gradeLevelCounts[gradeLevel] = { timeIn: 0, timeOut: 0 };
            }
            
            if (tapCount === 1) {
                gradeLevelCounts[gradeLevel].timeIn++;
            } else if (tapCount === 2) {
                // For time out, we don't increment timeIn again since it was already counted
                gradeLevelCounts[gradeLevel].timeOut++;
            }
            
            // Update grade level order (move to front)
            const index = gradeLevelOrder.indexOf(gradeLevel);
            if (index > -1) {
                gradeLevelOrder.splice(index, 1);
            }
            gradeLevelOrder.unshift(gradeLevel);
        }

        scanLog.unshift(scanEntry);

        if (scanLog.length > 3) {
            scanLog = scanLog.slice(0, 3);
        }

        stopDotAnimation();
        displayText.textContent = `✓ ${studentName}`;
        dotsSpan.textContent = '';
        
        // Add success styling
        const rfidDisplay = document.querySelector('.rfid-display');
        rfidDisplay.classList.add('success');
        
        updateScanLog();

        setTimeout(() => {
            // Remove success styling and return to normal
            rfidDisplay.classList.remove('success');
            displayText.textContent = 'Ready for RFID Tap';
            dotsSpan.textContent = '.';
            startDotAnimation();
        }, 2000);

    } catch (error) {
        console.error('Error handling RFID scan:', error);
        stopDotAnimation();
        displayText.textContent = `✗ Error: ${error.message}`;
        dotsSpan.textContent = '';
        
        setTimeout(() => {
            displayText.textContent = 'Ready for RFID Tap';
            dotsSpan.textContent = '.';
            startDotAnimation();
        }, 3000);
    }
}

// Fast refresh for specific RFID - checks database directly
async function refreshRfidState(specificRfid) {
    try {
        console.log(`⚡ Fast refresh for RFID: ${specificRfid}`);
        
        const today = new Date().toISOString().split('T')[0];
        const logs = await window.rfidAPI.getRecentLogs(100); // Get recent logs
        
        // Filter for today's logs for this specific RFID
        const todayLogsForRfid = logs.filter(log => {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            return logDate === today && log.rfid === specificRfid;
        });
        
        console.log(`📊 Found ${todayLogsForRfid.length} logs for RFID ${specificRfid} today`);
        
        // Get student info for grade level updates
        const student = await window.rfidAPI.getStudentByRfid(specificRfid);
        const gradeLevel = student ? student.grade_sections.grade_level : null;
        
        // Get previous count for this RFID to adjust grade level counts
        const previousCount = rfidCounts[specificRfid] || 0;
        
        // Reset state for this RFID
        if (todayLogsForRfid.length === 0) {
            // No logs found - reset completely
            delete rfidCounts[specificRfid];
            delete rfidTimestamps[specificRfid];
            
            // Adjust grade level counts if needed
            if (gradeLevel && previousCount > 0 && gradeLevelCounts[gradeLevel]) {
                if (previousCount === 1) {
                    gradeLevelCounts[gradeLevel].timeIn = Math.max(0, gradeLevelCounts[gradeLevel].timeIn - 1);
                } else if (previousCount === 2) {
                    gradeLevelCounts[gradeLevel].timeIn = Math.max(0, gradeLevelCounts[gradeLevel].timeIn - 1);
                    gradeLevelCounts[gradeLevel].timeOut = Math.max(0, gradeLevelCounts[gradeLevel].timeOut - 1);
                }
                
                // Clean up grade level if no students left
                if (gradeLevelCounts[gradeLevel].timeIn === 0 && gradeLevelCounts[gradeLevel].timeOut === 0) {
                    delete gradeLevelCounts[gradeLevel];
                    const index = gradeLevelOrder.indexOf(gradeLevel);
                    if (index > -1) {
                        gradeLevelOrder.splice(index, 1);
                    }
                }
            }
            
            console.log(`🧹 Cleared state for RFID ${specificRfid} - no logs found`);
        } else {
            // Process logs to get current state
            const sortedLogs = todayLogsForRfid.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            let count = 0;
            let firstTimestamp = null;
            
            sortedLogs.forEach(log => {
                if (log.tap_type === 'time_in') {
                    count = Math.max(count, 1);
                    if (!firstTimestamp) {
                        firstTimestamp = new Date(log.timestamp).getTime();
                    }
                } else if (log.tap_type === 'time_out') {
                    count = Math.max(count, 2);
                }
            });
            
            rfidCounts[specificRfid] = count;
            if (firstTimestamp) {
                rfidTimestamps[specificRfid] = firstTimestamp;
            }
            
            console.log(`📋 Updated state for RFID ${specificRfid}: count=${count}`);
        }
        
    } catch (error) {
        console.error(`❌ Error refreshing state for RFID ${specificRfid}:`, error);
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
                        displayText.textContent = 'Ready for RFID Tap';
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
                        displayText.textContent = 'Ready for RFID Tap';
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
        displayText.textContent = 'Ready for RFID Tap';
        dotsSpan.textContent = '.';
        startDotAnimation();
    }, 2000);
});

function updateScanLog() {
    // Calculate total time in and time out
    let totalTimeIn = 0;
    let totalTimeOut = 0;
    
    Object.values(rfidCounts).forEach(count => {
        if (count >= 1) totalTimeIn++;
        if (count >= 2) totalTimeOut++;
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
            const hiddenClass = gradeCountersVisible ? '' : ' hidden';
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

    scanLogDiv.innerHTML = counterDisplay + scanLog.map((scan) => {
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
    attachTotalCounterToggle();
}

// Toggle grade counters visibility
function toggleGradeCounters() {
    gradeCountersVisible = !gradeCountersVisible;
    const gradeCounters = document.querySelectorAll('.grade-counter');
    
    gradeCounters.forEach(counter => {
        if (gradeCountersVisible) {
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    });
}

// Attach click event listener to total counter
function attachTotalCounterToggle() {
    const totalCounter = document.querySelector('.total-counter');
    if (totalCounter) {
        // Remove any existing listener
        totalCounter.replaceWith(totalCounter.cloneNode(true));
        
        // Attach new listener
        const newTotalCounter = document.querySelector('.total-counter');
        newTotalCounter.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleGradeCounters();
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

// Double-click to toggle fullscreen
document.addEventListener('dblclick', (e) => {
    // Don't trigger fullscreen if clicking on buttons or interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
    }
    
    // Toggle fullscreen
    window.rfidAPI.toggleFullscreen();
});
