// Loading page functionality as ES6 module

let navigationInProgress = false;

export function initializeLoading() {
    console.log('🎬 Loading page started');
    
    // Reset navigation flag
    navigationInProgress = false;
    
    // Check if we're in test mode (bypass was used)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTestMode = user.id === 'test-user';
    
    if (isTestMode) {
        console.log('🧪 Test mode detected - skipping loading delay');
        // Navigate immediately in test mode
        setTimeout(() => {
            if (!navigationInProgress) {
                navigationInProgress = true;
                console.log('🚀 Initiating immediate navigation to dashboard (test mode)...');
                
                const loadingSubtitle = document.getElementById('loadingSubtitle');
                if (loadingSubtitle) {
                    loadingSubtitle.textContent = "Test mode - launching dashboard...";
                }
                
                if (window.electronAPI && window.electronAPI.navigateTo) {
                    window.electronAPI.navigateTo('dashboard');
                } else {
                    window.location.assign('dashboard.html');
                }
            }
        }, 500); // Just a brief 0.5 second delay for visual feedback
        return; // Exit early, skip normal loading sequence
    }
    
    // Normal loading sequence for regular users
    const loadingMessages = [
        "Initializing system...",
        "Loading student data...",
        "Preparing dashboard...",
        "Setting up interface...",
        "Almost ready..."
    ];
    const loadingSubtitle = document.getElementById('loadingSubtitle');
    let messageIndex = 0;
    
    function cycleMessages() {
        if (loadingSubtitle && !navigationInProgress) {
            loadingSubtitle.textContent = loadingMessages[messageIndex];
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }
        
        // Continue cycling messages only if not navigating
        if (!navigationInProgress) {
            setTimeout(cycleMessages, 1200);
        }
    }
    
    // Start message cycling after a short delay
    setTimeout(cycleMessages, 1000);
    
    // Navigate to dashboard after loading time
    setTimeout(() => {
        if (!navigationInProgress) {
            navigationInProgress = true;
            console.log('🚀 Initiating navigation to dashboard...');
            
            if (loadingSubtitle) {
                loadingSubtitle.textContent = "Launching dashboard...";
            }
            
            if (window.electronAPI && window.electronAPI.navigateTo) {
                window.electronAPI.navigateTo('dashboard');
            } else {
                window.location.assign('dashboard.html');
            }
        }
    }, 6000); // 6 seconds total loading time
    
    // Preload dashboard resources
    preloadDashboardResources();
    
    console.log('✅ Loading screen initialized');
}

function preloadDashboardResources() {
    const resourcesToPreload = [
        'dashboard.html',
        'css/dashboard-styles.css',
        'css/shared-styles.css'
    ];
    
    resourcesToPreload.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}
