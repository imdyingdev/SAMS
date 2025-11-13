// Display and Animation Management Module
export class DisplayManager {
    constructor() {
        this.displayText = document.getElementById('display-text');
        this.dotsSpan = document.getElementById('dots');
        this.dotCount = 0;
        this.animationInterval = null;
        this.isWindowFocused = true;
        this.previousDisplayText = '';
    }

    // Initialize display manager
    init() {
        this.setupFocusListener();
        this.startDotAnimation();
    }

    // Setup window focus change listener
    setupFocusListener() {
        window.rfidAPI.onFocusChanged((isFocused) => {
            this.isWindowFocused = isFocused;
            const rfidDisplay = document.querySelector('.rfid-display');
            
            if (!isFocused) {
                rfidDisplay.classList.add('unfocused');
                this.previousDisplayText = this.displayText.textContent;
                this.stopDotAnimation();
                this.displayText.innerHTML = 'Click here to focus<br>before tap a card...';
                this.dotsSpan.textContent = '';
            } else {
                rfidDisplay.classList.remove('unfocused');
                this.displayText.textContent = 'Ready for RFID Tap';
                this.dotsSpan.textContent = '.';
                this.startDotAnimation();
            }
        });
    }

    // Start dot animation
    startDotAnimation() {
        if (!this.isWindowFocused) {
            return;
        }
        
        this.dotCount = 1;
        if (this.dotsSpan) {
            this.dotsSpan.textContent = '.'.repeat(this.dotCount);
        }
        
        this.animationInterval = setInterval(() => {
            if (!this.isWindowFocused) {
                this.stopDotAnimation();
                if (this.dotsSpan) {
                    this.dotsSpan.textContent = '';
                }
                return;
            }
            
            this.dotCount = (this.dotCount % 3) + 1;
            if (this.dotsSpan) {
                this.dotsSpan.textContent = '.'.repeat(this.dotCount);
            }
        }, 500);
    }

    // Stop dot animation
    stopDotAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.dotsSpan) {
            this.dotsSpan.textContent = '';
        }
    }

    // Show success message with different styles for time in vs time out
    showSuccess(studentName, isTimeOut = false) {
        this.stopDotAnimation();
        this.displayText.textContent = `✓ ${studentName}`;
        this.dotsSpan.textContent = '';
        
        const rfidDisplay = document.querySelector('.rfid-display');
        
        // Apply different background gradients based on action
        if (isTimeOut) {
            // Time out - pink gradient
            rfidDisplay.style.backgroundImage = 'linear-gradient(to right top, #ff75ca, #f25eae, #e34693, #d32c78, #c2005e)';
        } else {
            // Time in - green gradient  
            rfidDisplay.style.backgroundImage = 'linear-gradient(to right top, #23ff00, #1bdc00, #13bb00, #0c9a00, #067b00)';
        }
        
        rfidDisplay.classList.add('success');

        setTimeout(() => {
            rfidDisplay.classList.remove('success', 'processing');
            rfidDisplay.style.backgroundImage = ''; // Reset background
            this.displayText.textContent = 'Ready for RFID Tap';
            this.dotsSpan.textContent = '.';
            this.startDotAnimation();
        }, 3000);
    }

    // Show error message with different backgrounds based on error type
    showError(message, duration = 3000, errorType = 'default') {
        this.stopDotAnimation();
        this.displayText.textContent = message;
        this.dotsSpan.textContent = '';
        
        const rfidDisplay = document.querySelector('.rfid-display');
        
        // Apply different background gradients based on error type
        switch (errorType) {
            case 'completed':
                // Already completed - blue gradient
                rfidDisplay.style.backgroundImage = 'linear-gradient(to right top, #00ffc8, #00d4cd, #00a7c2, #007ba5, #00517b)';
                rfidDisplay.classList.add('completed');
                break;
            case 'notFound':
                // Not found - red gradient
                rfidDisplay.style.backgroundImage = 'linear-gradient(to right top, #ff0000, #dd0003, #bb0004, #9a0004, #7b0000)';
                rfidDisplay.classList.add('not-found');
                break;
            default:
                // Default error - no special background
                rfidDisplay.style.backgroundImage = '';
                break;
        }
        
        setTimeout(() => {
            rfidDisplay.style.backgroundImage = ''; // Reset background
            rfidDisplay.classList.remove('completed', 'not-found'); // Remove state classes
            this.displayText.textContent = 'Ready for RFID Tap';
            this.dotsSpan.textContent = '.';
            this.startDotAnimation();
        }, duration);
    }

    // Show processing state (instant display while background processing)
    showProcessing(studentName) {
        this.stopDotAnimation();
        this.displayText.textContent = `⚡ ${studentName}`;
        this.dotsSpan.textContent = '';
        
        const rfidDisplay = document.querySelector('.rfid-display');
        // Light blue processing gradient
        rfidDisplay.style.backgroundImage = 'linear-gradient(to right top, #87ceeb, #5bb7e0, #2fa0d5, #0088c9, #0071be)';
        rfidDisplay.classList.add('processing');
    }

    // Show typing state
    showTyping(rfid) {
        this.stopDotAnimation();
        this.displayText.textContent = rfid;
        this.dotsSpan.textContent = '';
    }

    // Show cancelled state
    showCancelled() {
        this.stopDotAnimation();
        this.displayText.textContent = 'Cancelled';
        this.dotsSpan.textContent = '';

        setTimeout(() => {
            this.displayText.textContent = 'Ready for RFID Tap';
            this.dotsSpan.textContent = '.';
            this.startDotAnimation();
        }, 2000);
    }

    // Check if window is focused
    isWindowFocusedState() {
        return this.isWindowFocused;
    }
}
