// Student Cache Service - For instant RFID response
const { getAllStudentsWithRfid } = require('./studentService');

class StudentCache {
    constructor() {
        this.cache = new Map(); // RFID -> Student data
        this.lastUpdate = null;
        this.isInitialized = false;
        this.initPromise = null;
    }

    /**
     * Initialize cache by loading all students with RFIDs
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._loadStudents();
        return this.initPromise;
    }

    /**
     * Load all students into cache
     * @private
     */
    async _loadStudents() {
        try {
            console.log('Loading students into cache...');
            const students = await getAllStudentsWithRfid();
            
            this.cache.clear();
            students.forEach(student => {
                if (student.rfid) {
                    this.cache.set(student.rfid, student);
                }
            });
            
            this.lastUpdate = new Date();
            this.isInitialized = true;
            
            console.log(`Cache initialized with ${this.cache.size} students`);
        } catch (error) {
            console.error('Error initializing student cache:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Get student by RFID from cache (instant)
     * @param {string} rfid - The RFID/UID
     * @returns {Object|null} Student data or null if not found
     */
    getStudent(rfid) {
        if (!this.isInitialized) {
            console.warn('⚠️ Cache not initialized, returning null');
            return null;
        }
        
        return this.cache.get(rfid) || null;
    }

    /**
     * Check if RFID exists in cache (instant)
     * @param {string} rfid - The RFID/UID  
     * @returns {boolean} True if student exists
     */
    hasStudent(rfid) {
        return this.cache.has(rfid);
    }

    /**
     * Add or update student in cache
     * @param {string} rfid - The RFID/UID
     * @param {Object} student - Student data
     */
    updateStudent(rfid, student) {
        if (rfid && student) {
            this.cache.set(rfid, student);
            console.log(`Cache updated for RFID: ${rfid}`);
        }
    }

    /**
     * Remove student from cache
     * @param {string} rfid - The RFID/UID
     */
    removeStudent(rfid) {
        if (this.cache.delete(rfid)) {
            console.log(`Cache removed for RFID: ${rfid}`);
        }
    }

    /**
     * Refresh cache from database
     * @returns {Promise<void>}
     */
    async refresh() {
        console.log('Refreshing student cache...');
        this.initPromise = null;
        await this.initialize();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            lastUpdate: this.lastUpdate,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Check if cache needs refresh (older than 1 hour)
     * @returns {boolean} True if cache is stale
     */
    isStale() {
        if (!this.lastUpdate) return true;
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return this.lastUpdate < hourAgo;
    }
}

// Export singleton instance
const studentCache = new StudentCache();

module.exports = {
    studentCache,
    StudentCache
};
