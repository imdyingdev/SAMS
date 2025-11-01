import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('Building SAMS Desktop Application...');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure dist directory exists and copy preload.js
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy preload.js to dist directory
const preloadSrc = path.join(__dirname, 'src', 'preload.js');
const preloadDest = path.join(__dirname, 'dist', 'preload.js');

if (fs.existsSync(preloadSrc)) {
    console.log('Copying preload script...');
    fs.copyFileSync(preloadSrc, preloadDest);
}

// Renderer files are now developed directly in public/ directory
// No copying needed

// Copy assets if they exist
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(__dirname, 'public', 'assets');

if (fs.existsSync(assetsSrc)) {
    console.log('Copying assets...');
    copyDir(assetsSrc, assetsDest);
}

console.log('Build completed successfully!');