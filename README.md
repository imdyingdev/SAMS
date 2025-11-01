# SAMS - Student Attendance Management System

A comprehensive student attendance management system built with modern web technologies. SAMS provides real-time RFID-based attendance tracking with cross-platform desktop and mobile applications.

## 🏗️ Architecture

SAMS follows a microservices architecture with the following components:

- **Desktop Client** - Electron-based admin interface
- **Mobile Client** - React Native/Expo student app
- **Email Service** - Node.js microservice for email verification
- **RFID Service** - Electron-based RFID scanning application

## 📱 Applications

### Desktop Client (`client/desktop/`)
- **Technology**: Electron, PostgreSQL, ECharts
- **Purpose**: Administrative interface for managing students and viewing analytics
- **Features**: Student management, RFID integration, dashboard analytics, user authentication

### Mobile Client (`client/mobiles/`)
- **Technology**: React Native, Expo, Supabase
- **Purpose**: Student-facing mobile application
- **Features**: Personal dashboard, attendance history, real-time updates, profile management

### Email Service (`client/server/email-service/`)
- **Technology**: Node.js, Express, Resend API
- **Purpose**: Email verification microservice
- **Features**: Verification codes, email templates, CORS support

### RFID Service (`client/server/rfid-service/`)
- **Technology**: Electron, Supabase, Serial communication
- **Purpose**: RFID card scanning and student identification
- **Features**: Real-time scanning, student lookup, attendance logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Supabase account
- RFID scanner hardware (for RFID service)
- Resend account (for email service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/imdyingdev/SAMS.git
   cd SAMS
   ```

2. **Set up Desktop Client**
   ```bash
   cd client/desktop
   npm install
   cp .env.example .env
   # Configure your PostgreSQL database in .env
   npm run build
   npm start
   ```

3. **Set up Mobile Client**
   ```bash
   cd client/mobiles
   npm install
   cp .env.example .env
   # Configure your Supabase credentials in .env
   npm start
   ```

4. **Set up Email Service**
   ```bash
   cd client/server/email-service
   npm install
   cp .env.example .env
   # Configure your Resend API key in .env
   npm start
   ```

5. **Set up RFID Service**
   ```bash
   cd client/server/rfid-service
   npm install
   cp .env.example .env
   # Configure your Supabase credentials in .env
   npm start
   ```

## 🗄️ Database Setup

### PostgreSQL (Desktop Client)
The desktop client uses PostgreSQL for local data storage. The application will automatically create the necessary tables on first run.

### Supabase (Mobile & RFID Services)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `client/server/rfid-service/schema.sql`
3. Configure Row Level Security (RLS) policies
4. Add your Supabase credentials to the respective `.env` files

## 🔧 Configuration

Each component has its own configuration requirements:

### Desktop Client
- PostgreSQL database connection
- RFID scanner serial port settings
- Admin user credentials

### Mobile Client
- Supabase URL and API keys
- App-specific settings in `app.json`

### Email Service
- Resend API key
- SMTP configuration
- Email templates

### RFID Service
- Supabase connection
- RFID scanner hardware settings
- UI customization options

## 📖 Documentation

Detailed documentation for each component:

- [Desktop Client README](client/desktop/README.md)
- [Mobile Client README](client/mobiles/README.md)
- [Email Service README](client/server/email-service/README.md)
- [RFID Service README](client/server/rfid-service/README.md)

## 🏃‍♂️ Development

### Development Workflow

1. **Start all services in development mode:**
   ```bash
   # Terminal 1 - Desktop Client
   cd client/desktop && npm run dev
   
   # Terminal 2 - Mobile Client
   cd client/mobiles && npm start
   
   # Terminal 3 - Email Service
   cd client/server/email-service && npm run dev
   
   # Terminal 4 - RFID Service
   cd client/server/rfid-service && npm run dev
   ```

2. **Testing the integration:**
   - Use the desktop client to manage students
   - Test RFID scanning with the RFID service
   - Verify mobile app receives real-time updates
   - Test email verification flow

### Code Style
- TypeScript for type safety (where applicable)
- ESLint and Prettier for code formatting
- Consistent naming conventions across all components
- Component-based architecture

## 🔒 Security

- Environment variables for sensitive configuration
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- Secure authentication mechanisms
- HTTPS in production environments

## 🚀 Deployment

### Desktop Client
- Build with `npm run dist-win` for Windows installer
- Distribute via internal channels or app stores

### Mobile Client
- Build with Expo: `expo build:ios` / `expo build:android`
- Deploy to App Store / Google Play Store

### Services
- Deploy email service to cloud platforms (Heroku, Vercel, etc.)
- RFID service runs locally on kiosk machines
- Use Docker for containerized deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License & Copyright

**Copyright (c) 2025 SAMS Development Team. All Rights Reserved.**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Copyright Notice
This software contains proprietary and confidential information. See [COPYRIGHT.txt](COPYRIGHT.txt) for full copyright terms and conditions.

### Third-Party Licenses
Individual components may have additional licensing terms. See respective component README files and package.json files for dependency licensing information.

## 🆘 Support

For support and questions:
- Check the individual component README files
- Review the troubleshooting sections in each service
- Create an issue in the GitHub repository

## 🏷️ Version History

- **v1.0.0** - Initial release with core functionality
  - Desktop admin interface
  - Mobile student app
  - RFID scanning service
  - Email verification service

---

**Built with ❤️ for educational institutions seeking modern attendance management solutions.**
