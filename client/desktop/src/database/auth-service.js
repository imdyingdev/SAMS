import { query } from './db-connection.js';

// Login function with better error handling
async function authenticateUser(username, password) {
  try {
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    // First, check if ANY admin users exist in the database
    const adminCountQuery = `SELECT COUNT(*) as count FROM admin_users WHERE is_active = true`;
    const countResult = await query(adminCountQuery);
    const adminCount = parseInt(countResult.rows[0].count);
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    // If no admin users exist, auto-regenerate the default admin
    if (adminCount === 0) {
      console.warn('[AUTH] No admin users found - auto-regenerating default admin');
      await createDefaultAdmin();
      console.log('[AUTH] Default admin user regenerated');
    }
<<<<<<< HEAD

    // Query to find user by username
    const userQuery = `
      SELECT id, username, password_hash, role, is_active, created_at
      FROM admin_users
      WHERE username = $1 AND is_active = true
    `;

    const result = await query(userQuery, [username]);

=======
    
    // Query to find user by username
    const userQuery = `
      SELECT id, username, password_hash, role, is_active, created_at
      FROM admin_users 
      WHERE username = $1 AND is_active = true
    `;
    
    const result = await query(userQuery, [username]);
    
>>>>>>> origin/main
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
<<<<<<< HEAD

    const user = result.rows[0];

    // Check password
    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.default.compare(password, user.password_hash);

=======
    
    const user = result.rows[0];
    
    // Check password
    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.default.compare(password, user.password_hash);
    
>>>>>>> origin/main
    if (!isPasswordValid) {
      await logLoginAttempt(user.id, false);
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
<<<<<<< HEAD

    // Log successful login
    await logLoginAttempt(user.id, true);

=======
    
    // Log successful login
    await logLoginAttempt(user.id, true);
    
>>>>>>> origin/main
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
  } catch (error) {
    console.error('Authentication error:', error.message);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
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
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    await query(logQuery, [userId, success, 'localhost']);
  } catch (error) {
    // Silent fail for login logging
  }
}

// Create a default admin user (for initial setup)
async function createDefaultAdmin() {
  try {
<<<<<<< HEAD

    // First check if admin already exists
    const checkQuery = `SELECT id FROM admin_users WHERE username = $1`;
    const existing = await query(checkQuery, ['admin']);

=======
    
    // First check if admin already exists
    const checkQuery = `SELECT id FROM admin_users WHERE username = $1`;
    const existing = await query(checkQuery, ['admin']);
    
>>>>>>> origin/main
    if (existing.rows.length > 0) {
      console.log('[AUTH] Default admin user already exists');
      return true;
    }
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    // Create new admin if it doesn't exist
    const bcrypt = await import('bcrypt');
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.default.hash(defaultPassword, 10);
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    const result = await query(`
      INSERT INTO admin_users (username, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING id
<<<<<<< HEAD
    `, ['admin', hashedPassword, 'administrator', true]);

=======
    `, ['admin', hashedPassword, 'admin', true]);
    
>>>>>>> origin/main
    if (result.rows.length > 0) {
      console.log('[AUTH] Default admin user created successfully');
      console.log('[AUTH] Username: admin');
      console.log('[AUTH] Password: admin123');
      console.log('[AUTH] IMPORTANT: Change this password in production!');
    }
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    return true;
  } catch (error) {
    console.error('[AUTH] Error creating default admin:', error.message);
    return false;
  }
}

<<<<<<< HEAD
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
=======
export {
  authenticateUser,
  logLoginAttempt,
  createDefaultAdmin
>>>>>>> origin/main
};
