# SAMS RFID Service

An Electron-based desktop application for RFID card scanning and student information retrieval in the Student Attendance Management System (SAMS). Provides real-time RFID scanning with Supabase integration.

## Features

- **Real-time RFID Scanning**: Continuous monitoring of RFID card taps
- **Student Information Display**: Instant student lookup by RFID
- **Attendance Logging**: Automatic time-in/time-out tracking
- **Live Statistics**: Real-time student count and activity metrics
- **Visual Feedback**: Animated UI with Lottie animations
- **Database Integration**: Supabase real-time database connectivity
- **Frameless UI**: Modern, kiosk-style interface
- **Always-on-top Option**: Configurable window behavior

## Prerequisites

- Node.js (v16 or higher)
- Electron (v25 or higher)
- RFID scanner hardware (USB/Serial compatible)
- Supabase account and project
- SAMS database schema

## Installation

1. Navigate to the RFID service directory:
   ```bash
   cd SAMS/client/server/rfid-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=development
   ```

4. Set up database schema:
   ```bash
   # Import the schema to your Supabase project
   psql -f schema.sql your_database_url
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Runs Electron in development mode with debugging enabled.

### Production Mode
```bash
npm start
```

The application will launch as a desktop window with RFID scanning capabilities.

## Project Structure

```
src/
├── main/
│   └── index.js          # Main Electron process
├── renderer/
│   ├── index.html        # Main UI
│   ├── styles.css        # Application styles
│   └── script.js         # Renderer logic
├── preload/
│   └── index.js          # Preload scripts
├── services/
│   ├── studentService.js     # Student data operations
│   └── rfidLogService.js     # RFID logging service
└── config/
    └── database.js       # Database configuration

assets/
├── how-it-work.json      # Lottie animation (instructions)
└── moon-waiting.json     # Lottie animation (waiting state)

schema.sql               # Database schema
.env.example            # Environment template
```

## Database Schema

The service requires the following Supabase tables:

### Students Table
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    lrn VARCHAR(20) UNIQUE NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    rfid VARCHAR(50) UNIQUE,
    gender VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### RFID Logs Table
```sql
CREATE TABLE rfid_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfid VARCHAR(50) NOT NULL,
    tap_count INTEGER DEFAULT 1,
    tap_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Features Overview

### RFID Scanning
- Continuous scanning for RFID card taps
- Automatic student identification
- Real-time database updates
- Visual and audio feedback

### Student Information Display
- Full name and details
- Grade level and LRN
- Profile photo (if available)
- Current attendance status

### Attendance Tracking
- Automatic time-in detection
- Time-out logging
- Daily attendance summaries
- Historical activity logs

### Real-time Updates
- Live student count display
- Recent activity feed
- Instant database synchronization
- WebSocket-based updates

## Configuration

### RFID Hardware Setup
1. Connect RFID scanner via USB
2. Install appropriate drivers
3. Configure serial port settings
4. Test scanner functionality

### Supabase Configuration
1. Create Supabase project
2. Set up database tables using `schema.sql`
3. Configure Row Level Security (RLS)
4. Generate API keys
5. Update `.env` with credentials

### UI Customization
- Modify `renderer/styles.css` for styling
- Update Lottie animations in assets folder
- Configure window properties in `main/index.js`

## Integration

This service integrates with:
- **SAMS Desktop App**: Shared database and student records
- **SAMS Mobile App**: Real-time attendance updates
- **RFID Hardware**: Physical card scanners
- **Supabase**: Cloud database and real-time subscriptions

### IPC Communication

The service uses Electron IPC for communication between processes:

```javascript
// Main to Renderer
mainWindow.webContents.send('student-found', studentData);
mainWindow.webContents.send('rfid-logged', logData);

// Renderer to Main
ipcRenderer.invoke('get-student-by-rfid', rfidCode);
ipcRenderer.invoke('log-rfid-activity', activityData);
```

## Security Considerations

- **Environment Variables**: Keep Supabase keys secure
- **Database Access**: Use RLS policies for data protection
- **Network Security**: Ensure secure connections to Supabase
- **Physical Security**: Secure RFID scanner hardware
- **Access Control**: Implement user authentication if needed

## Monitoring and Logging

### Application Logs
Monitor for:
- RFID scan events
- Database connection status
- Student lookup results
- Error conditions

### Database Monitoring
Track:
- Real-time subscription status
- Query performance
- Connection health
- Data synchronization

## Troubleshooting

### Common Issues

1. **RFID Scanner Not Detected**
   - Check USB connection
   - Verify driver installation
   - Test with device manager

2. **Database Connection Failed**
   - Verify Supabase credentials
   - Check network connectivity
   - Validate environment variables

3. **Student Not Found**
   - Verify RFID is registered
   - Check database records
   - Validate RFID format

4. **UI Not Responsive**
   - Check Electron process
   - Monitor memory usage
   - Restart application

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
DEBUG=true
```

View Electron DevTools:
```bash
npm run dev
# Press Ctrl+Shift+I in the application
```

## Hardware Requirements

### Minimum Specifications
- Windows 10/11, macOS 10.14+, or Linux
- 4GB RAM
- 100MB disk space
- USB port for RFID scanner

### Recommended RFID Scanners
- HID proximity card readers
- EM4100/EM4102 compatible
- USB or Serial interface
- 125kHz frequency

## License

MIT
