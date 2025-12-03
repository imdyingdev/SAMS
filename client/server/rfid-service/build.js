const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Building SAMS RFID Service Application...');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy preload.js to dist directory
const preloadSrc = path.join(__dirname, 'src', 'preload', 'index.js');
const preloadDest = path.join(__dirname, 'dist', 'preload.js');

if (fs.existsSync(preloadSrc)) {
    console.log('Copying preload script...');
    fs.copyFileSync(preloadSrc, preloadDest);
}

// Copy renderer files to dist directory
const rendererSrc = path.join(__dirname, 'src', 'renderer');
const rendererDest = path.join(__dirname, 'dist', 'renderer');

if (fs.existsSync(rendererSrc)) {
    console.log('Copying renderer files...');
    copyDir(rendererSrc, rendererDest);
}

// Copy assets if they exist
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(__dirname, 'dist', 'assets');

if (fs.existsSync(assetsSrc)) {
    console.log('Copying assets...');
    copyDir(assetsSrc, assetsDest);
}

// Copy lottie animation files to dist directory
const lottieFiles = ['how-it-work.json', 'moon-waiting.json'];
console.log('Copying lottie animation files...');
lottieFiles.forEach(file => {
    const lottieSrc = path.join(__dirname, file);
    const lottieDest = path.join(__dirname, 'dist', file);
    
    if (fs.existsSync(lottieSrc)) {
        fs.copyFileSync(lottieSrc, lottieDest);
        console.log(`  ✓ Copied ${file}`);
    } else {
        console.warn(`  ⚠ Warning: ${file} not found`);
    }
});

console.log('Build completed successfully!');
