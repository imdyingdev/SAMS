# SAMS Desktop Client

A desktop application for the Student Attendance Management System (SAMS) built with Electron.

## Features

- **Student Management**: Add, edit, delete, and view student records
- **RFID Integration**: Real-time RFID card scanning for attendance tracking
- **Dashboard Analytics**: Visual charts and statistics for attendance data
- **Database Management**: PostgreSQL integration for data persistence
- **User Authentication**: Secure login system with admin controls
- **Activity Logging**: Comprehensive logging of all system activities

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- RFID scanner (connected via serial port)

## Installation

1. Clone the repository and navigate to the desktop client:
   ```bash
   cd SAMS/client/desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and settings.

4. Build the application:
   ```bash
   npm run build
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Build Installer (Windows)
```bash
npm run dist-win
```

## Project Structure

```
src/
├── main.js          # Main Electron process
├── preload.js       # Preload scripts for renderer
├── database/        # Database services and connections
└── renderer/        # Renderer process files

public/
├── views/           # HTML pages
├── components/      # Reusable UI components
├── js/              # Client-side JavaScript
└── assets/          # Static assets
```

## Configuration

The application requires a PostgreSQL database. Configure your connection in the `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sams_db
DB_USER=your_username
DB_PASSWORD=your_password
```

## RFID Scanner Setup

Connect your RFID scanner via USB/Serial port. The application will automatically detect and connect to available serial ports for RFID scanning.

## Technologies Used

- **Electron** - Desktop application framework
- **PostgreSQL** - Database
- **ECharts** - Data visualization
- **SerialPort** - RFID scanner communication
- **bcrypt** - Password hashing

## License

ISC
