import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Conditionally apply SSL configuration
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const poolConfig = {
  connectionString,
};

// Only add SSL configuration for non-local connections or in production
if (isProduction || (connectionString && !connectionString.includes('localhost'))) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// Enhanced connection test with retry logic
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Testing database connection (attempt ${i + 1}/${retries})...`);
      
      const client = await pool.connect();
      
      // Test with a simple query
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('Database connected successfully!');
      console.log('Current time:', result.rows[0].current_time);
      console.log('PostgreSQL version:', result.rows[0].pg_version.split(' ')[0]);
      
      client.release();
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('All connection attempts failed. Please check:');
        console.error('1. Your internet connection');
        console.error('2. Database credentials in .env file');
        console.error('3. Supabase database status');
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
}

// Generic query function with better error handling
async function query(text, params) {
  const start = Date.now();
  let client;
  
  try {
    client = await pool.connect();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    console.log('Query executed successfully', { 
      duration: `${duration}ms`, 
      rows: result.rowCount,
      command: text.split(' ')[0]
    });
    
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

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
    
    // Check password - PLAIN TEXT COMPARISON (INSECURE)
    const isPasswordValid = password === user.password_hash;
    
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

// Create necessary tables with better error handling
async function initializeTables() {
  const tables = [
    {
      name: 'admin_users',
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'admin',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    },
    {
      name: 'login_logs',
      query: `
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES admin_users(id),
          success BOOLEAN NOT NULL,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45)
        )
      `
    },
    {
      name: 'students',
      query: `
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          student_id VARCHAR(20) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          grade_level VARCHAR(10) NOT NULL,
          section VARCHAR(10),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    },
    {
      name: 'attendance',
      query: `
        CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES students(id),
          attendance_date DATE NOT NULL,
          status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late', 'excused')),
          notes TEXT,
          recorded_by INTEGER REFERENCES admin_users(id),
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, attendance_date)
        )
      `
    }
  ];

  try {
    console.log('Initializing database tables...');
    
    for (const table of tables) {
      try {
        await query(table.query);
        console.log(`Table '${table.name}' initialized successfully`);
      } catch (error) {
        console.error(`Error creating table '${table.name}':`, error.message);
        throw error;
      }
    }
    
    console.log('All database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing tables:', error.message);
    return false;
  }
}

// Create a default admin user (for initial setup)
async function createDefaultAdmin() {
  try {
    console.log('Creating default admin user...');
    
    const defaultPassword = 'admin123';
    const hashedPassword = defaultPassword; // Plain text password (INSECURE)
    
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

// Enhanced graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Closing database pool...');
  pool.end(() => {
    console.log('Database pool closed');
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Closing database pool...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

async function saveStudent(studentData) {
  console.log('Attempting to save student:', studentData);

  const insertQuery = `
    INSERT INTO students (first_name, middle_name, last_name, suffix, lrn, grade_level, rfid)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const params = [
    studentData.first_name,
    studentData.middle_name,
    studentData.last_name,
    studentData.suffix,
    studentData.lrn,
    studentData.grade_level,
    studentData.rfid && studentData.rfid.trim() !== '' ? studentData.rfid : null
  ];

  try {
    const result = await query(insertQuery, params);
    console.log('Student saved successfully:', result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error in saveStudent:', error.message);
    // Provide a more specific error message if it's a unique constraint violation
    if (error.code === '23505') { // PostgreSQL unique violation error code
      if (error.constraint === 'students_lrn_key') {
        throw new Error('A student with this LRN already exists.');
      }
      if (error.constraint === 'students_rfid_key') {
        throw new Error('This RFID card is already assigned to another student.');
      }
    }
    throw new Error('Failed to save student to the database.');
  }
}

// Get all students with RFID assignments
async function getAllStudents() {
  try {
    console.log('📚 Fetching all students from database...');
    
    const result = await query(`
      SELECT 
        id,
        first_name,
        middle_name,
        last_name,
        suffix,
        lrn,
        grade_level,
        rfid,
        created_at
      FROM students 
      ORDER BY 
        grade_level ASC,
        last_name ASC,
        first_name ASC
    `);
    
    console.log(`✅ Retrieved ${result.rows.length} students`);
    return result.rows;
    
  } catch (error) {
    console.error('🔥 Error fetching students:', error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

// Delete a student by ID
async function deleteStudent(studentId) {
  try {
    console.log(`🗑️ Deleting student with ID: ${studentId}`);
    
    // First check if student exists
    const checkResult = await query(
      'SELECT first_name, last_name FROM students WHERE id = $1',
      [studentId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    const studentName = `${checkResult.rows[0].first_name} ${checkResult.rows[0].last_name}`;
    
    // Delete the student
    const deleteResult = await query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [studentId]
    );
    
    if (deleteResult.rows.length === 0) {
      throw new Error('Failed to delete student');
    }
    
    console.log(`✅ Successfully deleted student: ${studentName}`);
    return { success: true, deletedStudent: deleteResult.rows[0] };
    
  } catch (error) {
    console.error('🔥 Error deleting student:', error);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}

// Update a student's information
async function updateStudent(studentId, studentData) {
  try {
    console.log(`✏️ Updating student with ID: ${studentId}`);
    
    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      lrn,
      grade_level,
      rfid
    } = studentData;
    
    const result = await query(`
      UPDATE students 
      SET 
        first_name = $1,
        middle_name = $2,
        last_name = $3,
        suffix = $4,
        lrn = $5,
        grade_level = $6,
        rfid = $7
      WHERE id = $8
      RETURNING *
    `, [
      first_name,
      middle_name || null,
      last_name,
      suffix || null,
      lrn,
      grade_level,
      rfid && rfid.trim() !== '' ? rfid : null,
      studentId
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Student not found or update failed');
    }
    
    console.log(`✅ Successfully updated student: ${first_name} ${last_name}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('🔥 Error updating student:', error);
    throw new Error(`Failed to update student: ${error.message}`);
  }
}

// Get student by ID
async function getStudentById(studentId) {
  try {
    console.log(`🔍 Fetching student with ID: ${studentId}`);
    
    const result = await query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Student not found');
    }
    
    console.log(`✅ Found student: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('🔥 Error fetching student:', error);
    throw new Error(`Failed to fetch student: ${error.message}`);
  }
}

// Get student statistics by grade level for charts
async function getStudentStatsByGrade() {
  try {
    console.log('📊 Fetching student statistics by grade level...');
    
    const result = await query(`
      SELECT 
        grade_level,
        COUNT(*) as student_count
      FROM students 
      GROUP BY grade_level
      ORDER BY 
        CASE 
          WHEN grade_level = 'Kindergarten' OR grade_level = 'K' THEN 0
          WHEN grade_level = 'Grade 1' OR grade_level = 'G1' THEN 1
          WHEN grade_level = 'Grade 2' OR grade_level = 'G2' THEN 2
          WHEN grade_level = 'Grade 3' OR grade_level = 'G3' THEN 3
          WHEN grade_level = 'Grade 4' OR grade_level = 'G4' THEN 4
          WHEN grade_level = 'Grade 5' OR grade_level = 'G5' THEN 5
          WHEN grade_level = 'Grade 6' OR grade_level = 'G6' THEN 6
          ELSE 999
        END
    `);
    
    // Create a complete dataset with all grade levels (K, G1-G6)
    const gradeOrder = ['K', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
    const statsMap = {};
    
    // Initialize all grades with 0
    gradeOrder.forEach(grade => {
      statsMap[grade] = 0;
    });
    
    // Fill in actual counts - map different grade formats to standard format
    result.rows.forEach(row => {
      const gradeLevel = row.grade_level;
      let mappedGrade = null;
      
      if (gradeLevel === 'Kindergarten' || gradeLevel === 'K') {
        mappedGrade = 'K';
      } else if (gradeLevel === 'Grade 1' || gradeLevel === 'G1') {
        mappedGrade = 'G1';
      } else if (gradeLevel === 'Grade 2' || gradeLevel === 'G2') {
        mappedGrade = 'G2';
      } else if (gradeLevel === 'Grade 3' || gradeLevel === 'G3') {
        mappedGrade = 'G3';
      } else if (gradeLevel === 'Grade 4' || gradeLevel === 'G4') {
        mappedGrade = 'G4';
      } else if (gradeLevel === 'Grade 5' || gradeLevel === 'G5') {
        mappedGrade = 'G5';
      } else if (gradeLevel === 'Grade 6' || gradeLevel === 'G6') {
        mappedGrade = 'G6';
      }
      
      if (mappedGrade && gradeOrder.includes(mappedGrade)) {
        statsMap[mappedGrade] = parseInt(row.student_count);
      }
    });
    
    // Convert to array format for chart
    const chartData = gradeOrder.map(grade => statsMap[grade]);
    
    console.log(`✅ Retrieved student statistics:`, statsMap);
    console.log(`📊 Raw database results:`, result.rows);
    return {
      labels: gradeOrder,
      data: chartData,
      totalStudents: chartData.reduce((sum, count) => sum + count, 0)
    };
    
  } catch (error) {
    console.error('🔥 Error fetching student statistics:', error);
    throw new Error(`Failed to fetch student statistics: ${error.message}`);
  }
}

export {
  pool,
  query,
  testConnection,
  authenticateUser,
  initializeTables,
  createDefaultAdmin,
  saveStudent,
  getAllStudents,
  deleteStudent,
  updateStudent,
  getStudentById,
  getStudentStatsByGrade
};