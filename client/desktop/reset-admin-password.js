import { query, testConnection } from './src/database/db-connection.js';

async function resetAdminPassword() {
  console.log('🔧 Resetting admin password to plain text...\n');
  
  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed!');
      console.error('Please check your .env file and database connection.');
      process.exit(1);
    }
    
    console.log('✅ Database connected\n');
    
    // Update admin password to plain text
    const result = await query(`
      UPDATE admin_users 
      SET password_hash = 'admin123' 
      WHERE username = 'admin'
      RETURNING id, username, role
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123 (plain text)');
      console.log('\n⚠️  WARNING: Password is stored in PLAIN TEXT - not secure!\n');
    } else {
      console.log('⚠️  Admin user not found. Creating new admin user...');
      
      const createResult = await query(`
        INSERT INTO admin_users (username, password_hash, role, is_active)
        VALUES ('admin', 'admin123', 'administrator', true)
        RETURNING id, username, role
      `);
      
      if (createResult.rows.length > 0) {
        console.log('✅ Admin user created successfully!');
        console.log('   Username: admin');
        console.log('   Password: admin123 (plain text)');
        console.log('\n⚠️  WARNING: Password is stored in PLAIN TEXT - not secure!\n');
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

resetAdminPassword();
