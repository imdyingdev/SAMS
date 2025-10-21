/**
 * Mock Database service for SAMS Mobile App
 * React Native compatible - no actual database connection
 */

// Mock database service for React Native compatibility
console.log('Using mock database service for React Native compatibility');

/**
 * Mock Database service class
 */
class MockDatabaseService {
  /**
   * Mock query execution
   * @param text SQL query string
   * @param params Query parameters
   * @returns Promise with mock result
   */
  async query(text: string, params?: any[]) {
    console.log('Mock database query:', text, params);
    
    // Return mock result structure
    return {
      rows: [],
      rowCount: 0,
      command: 'SELECT',
      oid: null,
      fields: []
    };
  }

  /**
   * Mock connection test
   * @returns Promise<boolean> Always true for mock
   */
  async testConnection(): Promise<boolean> {
    console.log('Mock database connection test - always successful');
    return true;
  }

  /**
   * Mock close connection
   */
  async close(): Promise<void> {
    console.log('Mock database connection closed');
  }
}

// Export singleton instance
export const database = new MockDatabaseService();

// Export mock types
export type MockPool = any;
export type MockPoolClient = any;
