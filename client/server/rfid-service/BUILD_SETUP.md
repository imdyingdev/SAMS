# RFID Service Windows Build Setup

This document describes the Windows distribution build setup for the SAMS RFID Service, configured similarly to the desktop application.

## Build Configuration

### Scripts Added
- `npm run build` - Builds the application by copying files to dist directory
- `npm run start` - Builds and runs the application
- `npm run dist-win` - Creates Windows installer (.exe)

### Files Created/Modified

1. **package.json** - Added build configuration with:
   - electron-builder configuration
   - Windows-specific settings (NSIS installer)
   - Build scripts
   - Moved electron to devDependencies

2. **build.js** - Build script that:
   - Creates dist directory
   - Copies preload script to dist/preload.js
   - Copies renderer files to dist/renderer/
   - Copies assets to dist/assets/

3. **assets/icon.ico** - Windows application icon (copied from desktop app)

4. **src/main/index.js** - Updated to load files from dist directory:
   - Preload: `../../dist/preload.js`
   - Renderer: `../../dist/renderer/index.html`

## Usage

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Create Windows Installer
```bash
npm run dist-win
```

The Windows installer will be created in `dist-electron/SAMS RFID Service.exe` (~70MB).

## Build Output
- **dist-electron/SAMS RFID Service.exe** - Windows installer
- **dist-electron/win-unpacked/** - Unpacked application files
- **dist/** - Built application files for packaging

## Configuration Details
- **App ID**: com.sams.rfidservice
- **Product Name**: SAMS RFID Service
- **Installer Type**: NSIS (allows installation directory selection)
- **Architecture**: x64
- **Creates**: Desktop shortcut, Start Menu shortcut
