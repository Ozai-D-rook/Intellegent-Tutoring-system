const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../.env');

try {
    const rawBuffer = fs.readFileSync(file);
    // Check for UTF-16 LE BOM (FF FE)
    if (rawBuffer[0] === 0xFF && rawBuffer[1] === 0xFE) {
        console.log("Detected UTF-16 LE. Converting to UTF-8...");
        // Strip BOM (first 2 bytes) and decode
        const content = rawBuffer.subarray(2).toString('utf16le');
        // Write back as UTF-8
        fs.writeFileSync(file, content, 'utf8');
        console.log("SUCCESS: Converted .env to UTF-8.");
    } else {
        console.log("File does not appear to be UTF-16 LE. No changes made.");
    }
} catch (e) {
    console.error("Conversion failed:", e.message);
}
