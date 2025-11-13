// Renderer process - RFID Scanner application logic
const displayText = document.getElementById('display-text');
let dotsSpan = document.getElementById('dots');
const scanLogDiv = document.getElementById('scan-log');
let currentRfid = '';
let dotCount = 0;
let animationInterval;
let pendingRfid = '';
let isWindowFocused = true;
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
            loadDisplayData();
        }, 100);
    }
});

// Start dot animation immediately
startDotAnimation();

// Load display data from database (fully database-driven - no local state)
async function loadDisplayData() {
    try {
        console.log('🔄 Loading display data from database...');
        
        // Get grade level counts from database
        const gradeData = await window.rfidAPI.getTodayGradeLevelCounts();
        
        // Get recent logs from database  
        const recentLogs = await window.rfidAPI.getRecentLogsWithStudentInfo(3);
        
        // Update display with fresh database data
        updateScanLog(gradeData.gradeLevelCounts, gradeData.gradeLevelOrder, recentLogs);
        
        console.log('✅ Display data loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading display data:', error);
    }
}

// Load display data when app starts
loadDisplayData();

// Refresh display data periodically
setInterval(() => {
    console.log('🔄 Refreshing display data...');
    loadDisplayData();
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
        // Database handles all validation - no need for local state checking
        console.log(`🔍 Processing RFID: ${rfid}`);
        
        // Log to database (all validation happens in backend)
        const result = await window.rfidAPI.validateAndLogRfid(rfid, tapCount);

        // Success - update UI
        const studentName = result.student.first_name + ' ' + result.student.last_name;
        const gradeLevel = result.student.grade_sections.grade_level;
        const timestamp = new Date();
        // Refresh display data from database immediately to show new entry
        setTimeout(() => loadDisplayData(), 200);

        stopDotAnimation();
        displayText.textContent = `✓ ${studentName}`;
        dotsSpan.textContent = '';
        
        // Add success styling
        const rfidDisplay = document.querySelector('.rfid-display');
        rfidDisplay.classList.add('success');

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
        
        // Handle different types of errors with appropriate messages
        let errorMessage = error.message;
        if (errorMessage.includes('already timed in')) {
            displayText.textContent = `✗ Already timed in today`;
        } else if (errorMessage.includes('already timed out')) {
            displayText.textContent = `✗ Already completed for today`;
        } else if (errorMessage.includes('Duplicate tap detected')) {
            displayText.textContent = `✗ Please wait before tapping`;
        } else if (errorMessage.includes('Must time in first')) {
            displayText.textContent = `✗ Must time in first`;
        } else {
            displayText.textContent = `✗ Error: ${errorMessage}`;
        }
        
        dotsSpan.textContent = '';
        
        setTimeout(() => {
            displayText.textContent = 'Ready for RFID Tap';
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
                // Rate limiting check via database - prevent rapid successive taps
                const wasRecentlyTapped = await window.rfidAPI.wasRfidTappedRecently(rfidToProcess, 2);
                if (wasRecentlyTapped) {
                    console.warn(`⚠️ Rate limit: ${rfidToProcess} tapped too quickly`);
                    stopDotAnimation();
                    displayText.textContent = `✗ ${rfidToProcess} - Too fast, please wait`;
                    dotsSpan.textContent = '';

                    setTimeout(() => {
                        displayText.textContent = 'Ready for RFID Tap';
                        dotsSpan.textContent = '.';
                        startDotAnimation();
                    }, 2000);
                    return;
                }

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

                // Database handles all state validation - try time in first, then time out based on DB response
                try {
                    // Try time in first (backend will validate if this is appropriate)
                    await handleRfidScan(rfidToProcess, 1);
                } catch (timeInError) {
                    // If time in failed, try time out (backend will validate)
                    try {
                        await handleRfidScan(rfidToProcess, 2);
                    } catch (timeOutError) {
                        // Both failed - show the more specific error
                        let errorMessage = timeInError.message;
                        stopDotAnimation();
                        
                        if (errorMessage.includes('already timed in')) {
                            displayText.textContent = `✗ Already timed in today`;
                        } else if (errorMessage.includes('already timed out')) {
                            displayText.textContent = `✗ Already completed for today`;
                        } else if (errorMessage.includes('Duplicate tap')) {
                            displayText.textContent = `✗ Please wait before tapping`;
                        } else {
                            displayText.textContent = `✗ ${errorMessage}`;
                        }
                        
                        dotsSpan.textContent = '';
                        setTimeout(() => {
                            displayText.textContent = 'Ready for RFID Tap';
                            dotsSpan.textContent = '.';
                            startDotAnimation();
                        }, 3000);
                    }
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

function updateScanLog(gradeLevelCounts = {}, gradeLevelOrder = [], scanLog = []) {
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
