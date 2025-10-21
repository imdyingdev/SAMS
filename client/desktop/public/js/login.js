// Login functionality as ES6 module

// Helper function to show error messages
function showError(message) {
    // Create error element if it doesn't exist
    let errorEl = document.getElementById('loginError');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'loginError';
        errorEl.style.cssText = `
            color: #ff4757;
            background: rgba(255, 71, 87, 0.1);
            border: 1px solid rgba(255, 71, 87, 0.3);
            border-radius: var(--border-radius);
            padding: 12px;
            margin: 10px 0;
            font-size: 14px;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
        
        // Insert before the sign-in button
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            signInBtn.parentNode.insertBefore(errorEl, signInBtn);
        }
    }
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }, 5000);
}

export async function handleSignIn(event) {
    event.preventDefault();
    
    // Elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    const errorEl = document.getElementById('loginError');
    const btn = document.querySelector('.sign-in-btn');
    const originalText = btn ? btn.textContent : 'SIGN IN';
    
    // Reset error state
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }
    usernameInput?.setAttribute('aria-invalid', 'false');
    passwordInput?.setAttribute('aria-invalid', 'false');
    
    const username = usernameInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const termsAccepted = !!termsCheckbox?.checked;
    
    console.log('Attempting sign in...');
    
    // Basic validations with proper error messages
    if (!username) {
        showError('Please enter your username');
        usernameInput?.focus();
        return;
    }
    
    if (!password) {
        showError('Please enter your password');
        passwordInput?.focus();
        return;
    }
    
    if (!termsAccepted) {
        showError('Please accept the Terms of Service & Privacy Policy');
        termsCheckbox?.focus();
        return;
    }
    
    if (btn) {
        btn.textContent = 'SIGNING IN...';
        btn.disabled = true;
    }
    
    try {
        console.log(`Sending credentials for user: ${username}`);
        console.log('Available electronAPI methods:', window.electronAPI ? Object.keys(window.electronAPI) : 'electronAPI not found');
        
        if (!window.electronAPI || !window.electronAPI.login) {
            throw new Error('electronAPI.login is not available. Please check if the preload script is loaded correctly.');
        }
        
        const result = await window.electronAPI.login({ username, password });
        console.log('Received response from main process:', result);
        
        if (result.success) {
            console.log('Login successful. Storing user and navigating.');
            localStorage.setItem('user', JSON.stringify(result.user));
            
            if (window.electronAPI && window.electronAPI.navigateTo) {
                window.electronAPI.navigateTo('loading');
            } else {
                console.warn('electronAPI.navigateTo not found, falling back to location.assign');
                window.location.assign('loading.html');
            }
        } else {
            console.error('Login failed:', result.message);
            showError(result.message || 'Invalid username or password');
            usernameInput?.focus();
            usernameInput?.select?.();
        }
    } catch (err) {
        console.error('An unexpected error occurred during login:', err);
        showError('An unexpected error occurred. Please try again.');
        usernameInput?.focus();
    } finally {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
        console.log('Login attempt completed');
    }
}

// Simplified initialization - removed problematic parts
export function initializeLogin() {
    console.log('Initializing login functionality...');
    
    // Clear all input values on initialization
    clearAllInputs();
    
    // Simple password visibility toggle
    const passwordToggle = document.querySelector('.input-icon');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const pwInput = document.querySelector('input[type="password"], input[type="text"].password-field');
            if (pwInput.type === 'password') {
                pwInput.type = 'text';
                pwInput.classList.add('password-field'); // Mark as password field shown as text
                this.textContent = '🙈';
            } else {
                pwInput.type = 'password';
                pwInput.classList.remove('password-field');
                this.textContent = '👁️';
            }
        });
    }

    // Add simple focus effects without cloning inputs
    document.querySelectorAll('.form-input').forEach(input => {
        // Add simple, non-interfering focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Double-click handler for fullscreen (keep this)
    document.body.addEventListener('dblclick', (event) => {
        if (!event.target.closest('button, a, input')) {
            console.log('Double-click detected on body, sending IPC message...');
            window.electronAPI?.toggleMaximize();
        }
    });

    console.log('Available electronAPI methods:', window.electronAPI ? Object.keys(window.electronAPI) : 'Not Found');
    console.log('Login initialization complete');
}

// Simplified clear function - only clear values
function clearAllInputs() {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    console.log('All input values cleared');
}


// Make functions globally available for onclick handlers
window.handleSignIn = handleSignIn;