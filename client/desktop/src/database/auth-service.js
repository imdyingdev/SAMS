import { query } from './db-connection.js';

// Login function with better error handling
async function authenticateUser(username, password) {
  try {
    console.log(`Authenticating user: ${username}`);
    
    // Query to find user by username
    const userQuery = `
      SELECT id, username, password_hash, role, is_active, created_at
      FROM admin_users 
      WHERE username = $1 AND is_active = true
    `;
    
    const result = await query(userQuery, [username]);
    
    if (result.rows.length === 0) {
      console.log('User not found or inactive');
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
    
    const user = result.rows[0];
    console.log(`User found: ${user.username} (${user.role})`);
    
    // Check password
    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.default.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      await logLoginAttempt(user.id, false);
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
    
    // Log successful login
    await logLoginAttempt(user.id, true);
    console.log('Authentication successful');
    
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
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
    
    await query(logQuery, [userId, success, 'localhost']);
    console.log(`Login attempt logged for user ${userId}: ${success ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    console.error('Error logging login attempt:', error.message);
  }
}

// Create a default admin user (for initial setup)
async function createDefaultAdmin() {
  try {
    console.log('Creating default admin user...');
    
    const bcrypt = await import('bcrypt');
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.default.hash(defaultPassword, 10);
    
    const result = await query(`
      INSERT INTO admin_users (username, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id
    `, ['admin', hashedPassword, 'admin']);
    
    if (result.rows.length > 0) {
      console.log('Default admin user created successfully');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('    IMPORTANT: Change this password in production!');
    } else {
      console.log('Default admin user already exists');
    }
    
    return true;
  } catch (error) {
    console.error(' Error creating default admin:', error.message);
    return false;
  }
}

export {
  authenticateUser,
  logLoginAttempt,
  createDefaultAdmin
};
