// Centralized logout functionality
export function initializeLogout() {
    console.log('Initializing logout functionality...');
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
        console.log('❌ Logout button not found');
        return;
    }

    // Remove any existing event listeners to prevent duplicates
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
    
    // Add single event listener
    newLogoutBtn.addEventListener('click', handleLogout);
    console.log('✅ Logout button setup complete');
}

async function handleLogout(event) {
    console.log('🔓 Logout button clicked');
    
    const logoutBtn = event.target;
    
    // Prevent multiple clicks
    if (logoutBtn.disabled) {
        console.log('⚠️ Logout already in progress');
        return;
    }
    
    // Disable button and show loading state
    logoutBtn.disabled = true;
    const originalText = logoutBtn.textContent;
    logoutBtn.textContent = 'Logging out...';
    
    try {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ All user data cleared');
        
        // Clear any cached form data
        clearFormData();
        
        // Add a small delay to prevent rapid navigation requests
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Navigate back to login
        if (window.electronAPI && window.electronAPI.gotoLogin) {
            console.log('Using Electron API navigation');
            const result = await window.electronAPI.gotoLogin();
            
            if (result && result.success) {
                console.log('✅ Navigation successful');
            } else {
                console.log('❌ Navigation failed, using fallback');
                fallbackNavigation();
            }
        } else {
            console.log('Using fallback navigation');
            fallbackNavigation();
        }
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        
        // Re-enable button on error
        logoutBtn.disabled = false;
        logoutBtn.textContent = originalText;
        
        // Show user-friendly error message
        alert('Logout failed. Please try again.');
        
        // Try fallback navigation anyway
        fallbackNavigation();
    }
}

function clearFormData() {
    // Clear any form inputs that might be cached
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.reset) {
            form.reset();
        }
    });

    // Clear individual inputs and reset their states
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            input.value = '';
            input.checked = false;
            input.selected = false;
            // Reset disabled/readonly states that might have been set
            input.disabled = false;
            input.readOnly = false;
            input.style.pointerEvents = '';
            input.style.opacity = '';
        }
    });


    console.log('✅ Form data cleared and input states reset');
}

function fallbackNavigation() {
    try {
        window.location.href = 'index.html';
    } catch (error) {
        console.error('❌ Fallback navigation failed:', error);
        // Force reload as last resort
        window.location.reload();
    }
}

// Make logout function globally available
window.handleLogout = handleLogout;
window.initializeLogout = initializeLogout;
