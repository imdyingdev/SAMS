import { query } from './db-connection.js';
// bcrypt removed - using plain text passwords (INSECURE - FOR TESTING ONLY)

// Login function with better error handling
async function authenticateUser(username, password) {
  const logs = [];
  
  try {
    logs.push('[AUTH] Starting authentication...');

    // First, check if ANY admin users exist in the database
    const adminCountQuery = `SELECT COUNT(*) as count FROM admin_users WHERE is_active = true`;
    const countResult = await query(adminCountQuery);
    const adminCount = parseInt(countResult.rows[0].count);
    logs.push(`[AUTH] Active admin users: ${adminCount}`);

    // If no admin users exist, auto-regenerate the default admin
    if (adminCount === 0) {
      logs.push('[AUTH] No admin users found - auto-regenerating default admin');
      await createDefaultAdmin();
      logs.push('[AUTH] Default admin user regenerated');
    }

    // Query to find user by username
    const userQuery = `
      SELECT id, username, password_hash, role, is_active, created_at
      FROM admin_users
      WHERE username = $1 AND is_active = true
    `;

    const result = await query(userQuery, [username]);

    if (result.rows.length === 0) {
      logs.push('[AUTH] User not found in database');
      return {
        success: false,
        message: 'Invalid username or password',
        authLogs: logs
      };
    }

    const user = result.rows[0];
    
    logs.push('[AUTH] User found in database');
    logs.push(`[AUTH] Username: ${user.username}`);
    logs.push(`[AUTH] Password provided: "${password}"`);
    logs.push(`[AUTH] Password in DB: "${user.password_hash}"`);
    logs.push(`[AUTH] Password in DB length: ${user.password_hash ? user.password_hash.length : 0}`);

    // Check password - PLAIN TEXT COMPARISON (INSECURE)
    const isPasswordValid = password === user.password_hash;
    logs.push(`[AUTH] Password match: ${isPasswordValid}`);
    logs.push(`[AUTH] Comparison: "${password}" === "${user.password_hash}" = ${isPasswordValid}`);

    if (!isPasswordValid) {
      await logLoginAttempt(user.id, false);
      logs.push('[AUTH] Login FAILED - password mismatch');
      return {
        success: false,
        message: 'Invalid username or password',
        authLogs: logs
      };
    }

    // Log successful login
    await logLoginAttempt(user.id, true);
    logs.push('[AUTH] Login SUCCESSFUL');

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      authLogs: logs
    };

  } catch (error) {
    logs.push(`[AUTH] ERROR: ${error.message}`);
    logs.push(`[AUTH] Error stack: ${error.stack}`);
    logs.push(`[AUTH] DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    
    console.error('[AUTH] Authentication error:', error.message);
    console.error('[AUTH] Error stack:', error.stack);
    
    return {
      success: false,
      message: 'An error occurred during login. Please try again.',
      authLogs: logs
    };
  }
}

// Log login attempts for security
async function logLoginAttempt(userId, success) {
  try {
    const logQuery = `
      INSERT INTO login_logs (user_id, success, login_time, ip_address)
      VALUES ($1, $2, NOW(), $3)
    `;

    await query(logQuery, [userId, success, 'localhost']);
  } catch (error) {
    // Silent fail for login logging
  }
}

// Create a default admin user (for initial setup)
async function createDefaultAdmin() {
  try {

    // First check if admin already exists
    const checkQuery = `SELECT id FROM admin_users WHERE username = $1`;
    const existing = await query(checkQuery, ['admin']);

    if (existing.rows.length > 0) {
      console.log('[AUTH] Default admin user already exists');
      return true;
    }

    // Create new admin if it doesn't exist
    const defaultPassword = 'admin123';
    const hashedPassword = defaultPassword; // Plain text password (INSECURE)

    const result = await query(`
      INSERT INTO admin_users (username, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['admin', hashedPassword, 'administrator', true]);

    if (result.rows.length > 0) {
      console.log('[AUTH] Default admin user created successfully');
      console.log('[AUTH] Username: admin');
      console.log('[AUTH] Password: admin123');
      console.log('[AUTH] IMPORTANT: Change this password in production!');
    }

    return true;
  } catch (error) {
    console.error('[AUTH] Error creating default admin:', error.message);
    return false;
  }
}

// Update user role in admin_users table
async function updateUserRole(userId, newRole) {
  try {
    const updateQuery = `
      UPDATE admin_users
      SET role = $1
      WHERE id = $2 AND is_active = true
      RETURNING id, username, role
    `;

    const result = await query(updateQuery, [newRole, userId]);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'User not found or inactive'
      };
    }

    return {
      success: true,
      message: 'User role updated successfully',
      user: result.rows[0]
    };

  } catch (error) {
    console.error('Error updating user role:', error.message);
    return {
      success: false,
      message: 'An error occurred while updating the user role'
    };
  }
}

export {
  authenticateUser,
  logLoginAttempt,
  createDefaultAdmin,
  updateUserRole
};
