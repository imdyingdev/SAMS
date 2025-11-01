/**
 * Terms and Conditions Modal Component
 * Handles displaying and managing the terms modal
 */

class TermsModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.termsContent = null;
    }

    /**
     * Initialize the modal by loading HTML and CSS
     */
    async init() {
        try {
            // Create modal HTML directly instead of fetching
            this.modal = document.createElement('div');
            this.modal.id = 'termsModal';
            this.modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h2>Terms of Service & Privacy Policy</h2>
                            <button class="modal-close" onclick="closeTermsModal()">&times;</button>
                        </div>
                        <div class="modal-content">
                            <div class="terms-content" id="termsContent">
                                <div class="loading-spinner">Loading terms and conditions...</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-primary" onclick="closeTermsModal()">I Understand</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add CSS directly instead of fetching
            const cssContent = `
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px); display: flex; justify-content: center;
                    align-items: center; z-index: 10000; animation: fadeIn 0.3s ease-out;
                }
                .modal-container {
                    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px); border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); width: 90%; max-width: 800px;
                    max-height: 80vh; display: flex; flex-direction: column;
                    border: 1px solid rgba(255, 255, 255, 0.3); animation: slideIn 0.3s ease-out;
                    user-select: none; -webkit-user-select: none; -moz-user-select: none;
                    -ms-user-select: none; pointer-events: auto; position: relative;
                    -webkit-app-region: no-drag;
                }
                .modal-header {
                    padding: 24px 32px 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    display: flex; justify-content: space-between; align-items: center;
                    background: rgba(255, 255, 255, 0.8); border-radius: 16px 16px 0 0;
                }
                .modal-header h2 { margin: 0; color: #2c3e50; font-size: 24px; font-weight: 600; }
                .modal-close {
                    background: none; border: none; font-size: 32px; color: #7f8c8d; cursor: pointer;
                    padding: 0; width: 40px; height: 40px; display: flex; align-items: center;
                    justify-content: center; border-radius: 50%; transition: all 0.2s ease;
                }
                .modal-close:hover { background: rgba(231, 76, 60, 0.1); color: #e74c3c; transform: scale(1.1); }
                .modal-content { flex: 1; overflow-y: auto; padding: 0; }
                .terms-content { padding: 24px 32px; line-height: 1.6; color: #2c3e50; font-size: 14px; }
                .terms-content h1 { color: #2c3e50; font-size: 28px; margin-bottom: 16px; border-bottom: 2px solid #3498db; padding-bottom: 8px; }
                .terms-content h2 { color: #34495e; font-size: 20px; margin: 24px 0 12px; border-left: 4px solid #3498db; padding-left: 12px; }
                .terms-content h3 { color: #34495e; font-size: 16px; margin: 16px 0 8px; }
                .terms-content ul, .terms-content ol { margin: 12px 0; padding-left: 24px; }
                .terms-content li { margin: 6px 0; }
                .terms-content strong { color: #2c3e50; font-weight: 600; }
                .terms-content code { background: rgba(52, 152, 219, 0.1); padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 13px; }
                .modal-footer {
                    padding: 16px 32px 24px; border-top: 1px solid rgba(0, 0, 0, 0.1);
                    display: flex; justify-content: flex-end; background: rgba(255, 255, 255, 0.8);
                    border-radius: 0 0 16px 16px;
                }
                .modal-btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
                .modal-btn-primary { background: linear-gradient(135deg, #3498db, #2980b9); color: white; box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3); }
                .modal-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4); }
                .loading-spinner { text-align: center; padding: 40px; color: #7f8c8d; font-style: italic; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @media (max-width: 768px) {
                    .modal-container { width: 95%; max-height: 90vh; margin: 20px; }
                    .modal-header, .terms-content, .modal-footer { padding-left: 20px; padding-right: 20px; }
                    .modal-header h2 { font-size: 20px; }
                    .terms-content { font-size: 13px; }
                }
            `;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = cssContent;
            document.head.appendChild(styleElement);
            
            // Append modal to body
            document.body.appendChild(this.modal);
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Terms modal initialized successfully');
        } catch (error) {
            console.error('Error initializing terms modal:', error);
            throw error;
        }
    }

    /**
     * Set up event listeners for the modal
     */
    setupEventListeners() {
        if (!this.modal) return;

        // Close when clicking outside modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close with Escape key
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
    }

    /**
     * Load terms content - embedded HTML content
     */
    async loadTermsContent() {
        return `
            <h1>SAMS (Student Attendance Management System)</h1>
            
            <h2>Academic Capstone Project License</h2>
            <p><strong>Version 1.0 | Effective Date: September 2025</strong></p>
            
            <hr>
            
            <h2>1. PROJECT OVERVIEW</h2>
            <p>This Student Attendance Management System (SAMS) is developed as an academic capstone project. The software is provided for educational, research, and potential community implementation purposes.</p>
            
            <h2>2. USAGE RIGHTS</h2>
            
            <h3>2.1 Academic Use</h3>
            <ul>
                <li><strong>Permitted</strong>: Use for educational purposes, research, demonstration, and academic evaluation</li>
                <li><strong>Permitted</strong>: Modification and enhancement for learning purposes</li>
                <li><strong>Permitted</strong>: Portfolio inclusion and academic presentation</li>
            </ul>
            
            <h3>2.2 Community Partner Implementation</h3>
            <ul>
                <li><strong>Permitted</strong>: Deployment in educational institutions for student management</li>
                <li><strong>Permitted</strong>: Customization to meet specific institutional requirements</li>
                <li><strong>Permitted</strong>: Data migration and system integration</li>
                <li><strong>Required</strong>: Attribution to original developers in any deployment</li>
            </ul>
            
            <h2>3. DATA PROTECTION & PRIVACY</h2>
            
            <h3>3.1 Student Data Handling</h3>
            <ul>
                <li>All student personal information must be handled in compliance with local data protection laws</li>
                <li>RFID data and biometric information require explicit consent from students/guardians</li>
                <li>Database connections must use encrypted protocols (SSL/TLS)</li>
                <li>Regular data backups and security audits are recommended</li>
            </ul>
            
            <h3>3.2 Data Ownership</h3>
            <ul>
                <li>Educational institutions retain full ownership of their student data</li>
                <li>Developers claim no ownership over institutional data entered into the system</li>
                <li>Data export functionality must be maintained for institutional data portability</li>
            </ul>
            
            <h2>4. TECHNICAL REQUIREMENTS & LIMITATIONS</h2>
            
            <h3>4.1 System Requirements</h3>
            <ul>
                <li>Windows 10+ operating system</li>
                <li>Node.js 16+ runtime environment</li>
                <li>PostgreSQL database (local or cloud-based like Supabase)</li>
                <li>RFID scanner hardware compatibility (SerialPort integration)</li>
            </ul>
            
            <h3>4.2 Known Limitations</h3>
            <ul>
                <li>System designed for Windows desktop environments</li>
                <li>Requires technical setup for database configuration</li>
                <li>RFID hardware may need specific drivers or configuration</li>
            </ul>
            
            <h2>5. SUPPORT & MAINTENANCE</h2>
            
            <h3>5.1 Academic Support Period</h3>
            <ul>
                <li>Support provided during active capstone project period</li>
                <li>Bug fixes and minor enhancements available during development phase</li>
                <li>Documentation and setup assistance for community partners</li>
            </ul>
            
            <h3>5.2 Post-Academic Implementation</h3>
            <ul>
                <li>Community partners assume responsibility for ongoing maintenance</li>
                <li>Source code provided for institutional IT teams to manage</li>
                <li>No warranty or guaranteed support after project completion</li>
            </ul>
            
            <h2>6. LIABILITY & DISCLAIMERS</h2>
            
            <h3>6.1 Academic Project Disclaimer</h3>
            <ul>
                <li>Software provided "AS IS" for educational and demonstration purposes</li>
                <li>No warranty of fitness for production use without proper testing</li>
                <li>Developers not liable for data loss or system failures in production environments</li>
            </ul>
            
            <h3>6.2 Community Implementation</h3>
            <ul>
                <li>Institutions must conduct proper testing before production deployment</li>
                <li>Backup and disaster recovery procedures are institution's responsibility</li>
                <li>Security audits recommended before handling sensitive student data</li>
            </ul>
            
            <h2>7. INTELLECTUAL PROPERTY</h2>
            
            <h3>7.1 Open Source Components</h3>
            <ul>
                <li>Built using open-source libraries (Electron, Node.js, PostgreSQL drivers)</li>
                <li>Respects all third-party license requirements</li>
                <li>ECharts library used under Apache License 2.0</li>
            </ul>
            
            <h3>7.2 Original Code</h3>
            <ul>
                <li>Custom application code developed for academic purposes</li>
                <li>Attribution required for any derivative works</li>
                <li>Commercial use requires explicit permission from developers</li>
            </ul>
            
            <h2>8. MODIFICATION & DISTRIBUTION</h2>
            
            <h3>8.1 Permitted Modifications</h3>
            <ul>
                <li>Customization for specific institutional needs</li>
                <li>Integration with existing school management systems</li>
                <li>UI/UX improvements and localization</li>
            </ul>
            
            <h3>8.2 Distribution Requirements</h3>
            <ul>
                <li>Must include this license file with any distribution</li>
                <li>Attribution to original capstone project team required</li>
                <li>Modified versions should be clearly marked as such</li>
            </ul>
            
            <h2>9. TERMINATION</h2>
            
            <h3>9.1 Academic Period</h3>
            <ul>
                <li>License remains active throughout capstone project evaluation period</li>
                <li>Extensions possible for continued academic collaboration</li>
            </ul>
            
            <h3>9.2 Community Implementation</h3>
            <ul>
                <li>Perpetual license for educational institutions</li>
                <li>Termination only upon violation of data protection requirements</li>
                <li>30-day notice for any license modifications</li>
            </ul>
            
            <h2>10. CONTACT & ATTRIBUTION</h2>
            
            <h3>10.1 Academic Team</h3>
            <ul>
                <li><strong>Project</strong>: SAMS - Student Attendance Management System</li>
                <li><strong>Institution</strong>: Colegio De Montalban</li>
                <li><strong>Academic Year</strong>: 2024-2025</li>
                <li><strong>Contact</strong>: johnrgrafe@gmail.com</li>
            </ul>
            
            <h3>10.2 Community Partner Inquiries</h3>
            <ul>
                <li>Technical setup assistance available during project period</li>
                <li>Feature requests considered for academic learning objectives</li>
                <li>Collaboration opportunities welcomed for mutual benefit</li>
            </ul>
            
            <hr>
            
            <h2>ACCEPTANCE</h2>
            <p>By installing, using, or deploying this software, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</p>
            
            <p><strong>For Community Partners</strong>: Please contact the academic team before production deployment to ensure proper setup, training, and support arrangements.</p>
            
            <p><strong>For Academic Evaluation</strong>: This software demonstrates practical application of database design, desktop application development, hardware integration, and user interface design principles.</p>
            
            <hr>
            
            <p><em>This license is designed to balance academic learning objectives with practical community benefit while ensuring responsible data handling and appropriate attribution.</em></p>
        `;
    }

    /**
     * Convert markdown to HTML for display
     */
    convertMarkdownToHTML(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Code blocks (inline)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gim, '<p>$1</p>')
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '')
            // Fix nested lists
            .replace(/<\/ul>\s*<ul>/g, '')
            // Wrap everything in a container
            .replace(/^/, '<div>').replace(/$/, '</div>');
    }

    /**
     * Get fallback content if markdown file fails to load
     */
    getFallbackContent() {
        return `
            <div>
                <h1>Terms of Service & Privacy Policy</h1>
                <p><strong>This system is for authorized personnel only.</strong></p>
                <p>By using this system, you agree to:</p>
                <ul>
                    <li>Use the system only for official school purposes</li>
                    <li>Maintain confidentiality of student information</li>
                    <li>Report any security concerns immediately</li>
                    <li>Follow all data protection guidelines</li>
                </ul>
                <p>For full terms and conditions, please contact the school administration.</p>
                <p><strong>Contact:</strong> johnrgrafe@gmail.com</p>
                <p><strong>Institution:</strong> Colegio De Montalban</p>
            </div>
        `;
    }

    /**
     * Show the terms modal
     */
    async show() {
        if (!this.modal) {
            await this.init();
        }

        try {
            // Load terms content if not already loaded
            if (!this.termsContent) {
                const termsContentElement = this.modal.querySelector('#termsContent');
                termsContentElement.innerHTML = '<div class="loading-spinner">Loading terms and conditions...</div>';
                
                this.termsContent = await this.loadTermsContent();
                termsContentElement.innerHTML = this.termsContent;
            }

            // Show modal
            this.modal.style.display = 'flex';
            this.isOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            document.addEventListener('keydown', this.handleEscapeKey);
            
        } catch (error) {
            console.error('Error showing terms modal:', error);
            // Show fallback alert
            alert('Terms of Service & Privacy Policy\n\nThis system is for authorized personnel only. By using this system, you agree to:\n\n1. Use the system only for official school purposes\n2. Maintain confidentiality of student information\n3. Report any security concerns immediately\n4. Follow all data protection guidelines\n\nFor full terms, contact the school administration.');
        }
    }

    /**
     * Close the terms modal
     */
    close() {
        if (!this.modal || !this.isOpen) return;

        this.modal.style.display = 'none';
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Remove escape key listener
        document.removeEventListener('keydown', this.handleEscapeKey);
    }

    /**
     * Check if modal is currently open
     */
    isModalOpen() {
        return this.isOpen;
    }
}

// Create global instance
window.termsModal = new TermsModal();

// Global functions for onclick handlers
async function showTerms() {
    await window.termsModal.show();
}

function closeTermsModal() {
    window.termsModal.close();
}

// Make functions globally available
window.showTerms = showTerms;
window.closeTermsModal = closeTermsModal;

// Export for module usage
export { TermsModal, showTerms, closeTermsModal };
