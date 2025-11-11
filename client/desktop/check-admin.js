import { query, testConnection } from './src/database/db-connection.js';

async function checkAdmin() {
  console.log('🔍 Checking admin user in database...\n');
  
  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed!');
      process.exit(1);
    }
    
    console.log('✅ Database connected\n');
    
    // Get admin user details
    const result = await query(`
      SELECT id, username, password_hash, role, is_active, created_at
      FROM admin_users 
      WHERE username = 'admin'
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database!');
      console.log('   Run: npm run reset-password\n');
    } else {
      const admin = result.rows[0];
      console.log('✅ Admin user found:');
      console.log('   ID:', admin.id);
      console.log('   Username:', admin.username);
      console.log('   Password Hash:', admin.password_hash);
      console.log('   Password Hash Length:', admin.password_hash.length);
      console.log('   Role:', admin.role);
      console.log('   Active:', admin.is_active);
      console.log('   Created:', admin.created_at);
      
      console.log('\n📝 Analysis:');
      if (admin.password_hash === 'admin123') {
        console.log('   ✅ Password is plain text "admin123" - Login should work!');
      } else if (admin.password_hash.length >= 60) {
        console.log('   ⚠️  Password appears to be HASHED (bcrypt)');
        console.log('   ❌ This won\'t work with plain text comparison!');
        console.log('   🔧 Run: npm run reset-password');
      } else {
        console.log('   ⚠️  Password format unexpected');
        console.log('   Expected: "admin123"');
        console.log('   Got:', admin.password_hash);
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAdmin();
