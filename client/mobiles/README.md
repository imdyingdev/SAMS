# SAMS Mobile Client

A cross-platform mobile application for the Student Attendance Management System (SAMS) built with React Native and Expo.

## Features

- **Student Dashboard**: View personal attendance records and statistics
- **Real-time Activity Tracking**: Live updates of RFID tap events
- **Calendar Integration**: Visual calendar view of attendance history
- **Profile Management**: Update student information and account settings
- **Authentication**: Secure login system with session management
- **Offline Support**: Local data caching with network connectivity detection
- **Cross-platform**: Runs on iOS, Android, and Web

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Supabase account and project

## Installation

1. Navigate to the mobile client directory:
   ```bash
   cd SAMS/client/mobiles
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
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Usage

### Development

Start the development server:
```bash
npm start
# or
expo start
```

### Platform-specific Development

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### Building for Production

```bash
# Build for all platforms
expo build

# Build for specific platform
expo build:ios
expo build:android
```

## Project Structure

```
app/
├── (tabs)/              # Tab-based navigation screens
├── components/          # Reusable UI components
│   ├── ActivityList.tsx     # Student activity display
│   ├── CalendarScreen.tsx   # Calendar view component
│   ├── FloatingActionButton.tsx # Navigation FAB
│   └── SettingsView.tsx     # Settings interface
├── services/            # API and data services
│   ├── authService.ts       # Authentication logic
│   ├── database.ts          # Database operations
│   └── supabase.ts          # Supabase client config
├── styles/              # Style definitions
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── dashboard.tsx        # Main dashboard screen
├── login.tsx           # Login screen
├── profile.tsx         # User profile screen
└── _layout.tsx         # Root layout component

assets/
├── images/             # App icons and images
└── fonts/              # Custom fonts

components/             # Shared components
constants/              # App constants
```

## Key Dependencies

- **React Native** - Mobile app framework
- **Expo** - Development platform and build tools
- **Expo Router** - File-based navigation
- **Supabase** - Backend as a Service (database, auth)
- **React Native Reanimated** - Smooth animations
- **Lottie React Native** - Vector animations
- **React Native Calendars** - Calendar components
- **AsyncStorage** - Local data persistence

## Configuration

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up your database tables for students, users, and RFID logs
3. Configure Row Level Security (RLS) policies
4. Add your Supabase URL and anon key to `.env`

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Icons and splash screen
- Platform-specific settings
- Build configurations

## Features Overview

### Authentication
- Student login with email/password
- Session management with secure storage
- Auto-logout on inactivity

### Dashboard
- Real-time attendance status
- Recent activity feed
- Quick stats and summaries
- Swipeable tab navigation

### Activity Tracking
- Live RFID tap notifications
- Time-in/time-out logging
- Activity history with filtering
- Real-time updates via Supabase subscriptions

### Profile Management
- View and edit student information
- Account settings
- Password management
- Logout functionality

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Component-based architecture

### State Management
- React hooks for local state
- AsyncStorage for persistence
- Supabase real-time subscriptions

### Styling
- Custom style objects
- Responsive design principles
- Platform-specific adaptations

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Environment variables not loading**: Restart the development server
3. **Supabase connection errors**: Check your `.env` configuration
4. **Build failures**: Ensure all dependencies are properly installed

### Debug Mode

Enable debug logging by setting:
```env
EXPO_PUBLIC_DEBUG=true
```

## License

ISC
