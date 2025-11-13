// RFID Processing and Validation Module
export class RfidHandler {
    constructor(displayManager, dataManager) {
        this.displayManager = displayManager;
        this.dataManager = dataManager;
        this.pendingConfirmationRfid = null;
        
        // Random "not found" messages for better user experience
        this.notFoundMessages = [
            "✗ Oops! I can't find this card today.",
            "✗ Hmm… looks like this card isn't in the list.",
            "✗ Oh no! I didn't see your name here.",
            "✗ Card not found. Please try again.",
            "✗ Sorry! I couldn't read that card.",
            "✗ This card isn't registered yet.",
            "✗ Hmm… no record found for this one.",
            "✗ Oops! That ID doesn't seem to match anyone.",
            "✗ Can't find your card info right now.",
            "✗ Unrecognized card. Please try once more."
        ];
    }

    // Get a random "not found" message
    getRandomNotFoundMessage() {
        const randomIndex = Math.floor(Math.random() * this.notFoundMessages.length);
        return this.notFoundMessages[randomIndex];
    }

    // Check if RFID was tapped recently (rate limiting)
    async checkRateLimit(rfid) {
        try {
            console.log('Calling wasRfidTappedRecently API...');
            const wasRecentlyTapped = await window.rfidAPI.wasRfidTappedRecently(rfid, 2);
            console.log('Rate limit check result:', wasRecentlyTapped);
            if (wasRecentlyTapped) {
                console.warn(`Rate limit: ${rfid} tapped too quickly`);
                this.displayManager.showError(`✗ ${rfid} - Too fast, please wait`, 2000);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error in rate limit check:', error);
            // Don't block on rate limit errors, continue processing
            return false;
        }
    }

    // Validate student exists in database
    async validateStudent(rfid) {
        try {
            console.log('Calling getStudentByRfid API...');
            const student = await window.rfidAPI.getStudentByRfid(rfid);
            console.log('Student lookup result:', student);
            if (!student) {
                const randomMessage = this.getRandomNotFoundMessage();
                console.log('Using random not found message:', randomMessage);
                this.displayManager.showError(randomMessage, 3000, 'notFound');
                return null;
            }
            return student;
        } catch (error) {
            console.error('Error in student validation:', error);
            const randomMessage = this.getRandomNotFoundMessage();
            console.log('Using random not found message for error:', randomMessage);
            this.displayManager.showError(randomMessage, 3000, 'notFound');
            return null;
        }
    }

    // Handle RFID scan with database validation
    async handleRfidScan(rfid, tapCount, confirmed = false) {
        try {
            console.log(`Processing RFID: ${rfid} with tap count: ${tapCount}, confirmed: ${confirmed}`);
            
            // Log to database (all validation happens in backend)
            console.log('Calling validateAndLogRfid API...');
            const result = await window.rfidAPI.validateAndLogRfid(rfid, tapCount, confirmed);
            console.log('validateAndLogRfid result:', result);
            
            // Check if confirmation is required for early time out
            if (result && !result.success && result.requiresConfirmation) {
                return this.showTimeoutConfirmationModal(rfid, result);
            }

            if (result && result.success) {
                // Success - update UI
                const studentName = result.student.first_name + ' ' + result.student.last_name;
                console.log('Success! Student:', studentName);
                
                // Determine if this was a time out (tapCount === 2)
                const isTimeOut = tapCount === 2;
                
                // Force immediate refresh to show new entry right away
                console.log('Immediate refresh after successful scan...');
                this.dataManager.loadDisplayData();

                this.displayManager.showSuccess(studentName, isTimeOut);
            }

            // Return the result object for processing by caller
            return result;

        } catch (error) {
            console.error('Error handling RFID scan:', error);
            
            // Return error result object
            return {
                success: false,
                message: error.message,
                student: null,
                log: null
            };
        }
    }

    // Process RFID with smart logic (try time in first, then time out)
    async processRfid(rfid) {
        try {
            console.log('processRfid started for:', rfid);
            
            // ⚡ INSTANT DISPLAY: Check cache first for immediate feedback
            console.log('Checking cache for instant display...');
            const cachedStudent = await window.rfidAPI.getStudentFromCache(rfid);
            
            if (cachedStudent) {
                // Cache hit - student found, continue with background validation
                const studentName = `${cachedStudent.first_name} ${cachedStudent.last_name}`;
                console.log('Cache hit for instant validation:', studentName);
            } else {
                console.log('Student not found in cache, will validate via database');
            }
            
            // Rate limiting check via database (in background)
            console.log('Checking rate limit...');
            if (await this.checkRateLimit(rfid)) {
                console.log('Rate limit hit, stopping processing');
                return;
            }
            console.log('Rate limit check passed');

            // Validate student exists (fallback if not in cache)
            console.log('Validating student...');
            const student = cachedStudent || await this.validateStudent(rfid);
            if (!student) {
                console.log('Student validation failed');
                return;
            }
            console.log('Student validation passed:', student.first_name, student.last_name);

            // Database handles all state validation - try time in first, then time out based on DB response
            console.log('Starting database processing...');
            
            console.log('Trying time in first...');
            const timeInResult = await this.handleRfidScan(rfid, 1);
            
            if (timeInResult && timeInResult.success) {
                console.log('Time in successful');
                return; // Success, we're done
            }
            
            console.log('Time in failed:', timeInResult?.message);
            
            // If time in failed, try time out (backend will validate)
            console.log('Trying time out...');
            const timeOutResult = await this.handleRfidScan(rfid, 2);
            
            if (timeOutResult && timeOutResult.success) {
                console.log('Time out successful');
                return; // Success, we're done
            }
            
            console.log('Both time in and time out failed');
            console.log('Time in error:', timeInResult?.message);
            console.log('Time out error:', timeOutResult?.message);
            
            // Both failed - show the more specific error
            const errorMessage = timeInResult?.message || 'Unknown error';
            
            if (errorMessage.includes("You've already marked present today")) {
                this.displayManager.showError("You've already marked present today! See you again tomorrow.", 4000, 'completed');
            } else if (errorMessage === 'confirm_timeout_early') {
                // This case is handled by the modal logic above
                console.log('Early timeout confirmation handled by modal');
            } else if (errorMessage.includes('already timed in')) {
                this.displayManager.showError('✗ Already timed in today');
            } else if (errorMessage.includes('already timed out')) {
                this.displayManager.showError('✗ Already completed for today');
            } else if (errorMessage.includes('Duplicate tap')) {
                this.displayManager.showError('✗ Please wait before tapping');
            } else {
                this.displayManager.showError(`✗ ${errorMessage}`);
            }
        } catch (error) {
            console.error('Critical error in processRfid:', error);
            this.displayManager.showError(`✗ Critical error: ${error.message}`);
        }
    }

    // Show timeout confirmation modal for early time out attempts
    showTimeoutConfirmationModal(rfid, result) {
        this.pendingConfirmationRfid = rfid;
        const studentName = result.student.first_name + ' ' + result.student.last_name;
        const timeMinutes = result.timeSinceTimeIn;
        
        console.log(`Showing confirmation modal for ${studentName} (${timeMinutes} minutes since time in)`);
        
        // Update modal text dynamically
        const modal = document.getElementById('confirmModal');
        const modalText = modal.querySelector('p');
        modalText.textContent = `${studentName} timed in only ${timeMinutes} minute${timeMinutes !== 1 ? 's' : ''} ago. Time out now?`;
        
        // Show the modal
        modal.style.display = 'flex';
        
        // Return a special result to indicate modal is being shown
        return {
            success: false,
            message: 'modal_shown',
            modalShown: true
        };
    }

    // Handle confirmed timeout (called from eventHandlers)
    async handleConfirmedTimeout() {
        if (this.pendingConfirmationRfid) {
            const rfid = this.pendingConfirmationRfid;
            this.pendingConfirmationRfid = null;
            
            console.log('User confirmed early timeout for:', rfid);
            
            // Process with confirmed=true to bypass time window check
            return await this.handleRfidScan(rfid, 2, true);
        }
    }

    // Cancel timeout confirmation
    cancelTimeoutConfirmation() {
        console.log('User cancelled early timeout confirmation');
        this.pendingConfirmationRfid = null;
        this.displayManager.showCancelled();
    }
}
