const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../.env');
try {
    const buffer = fs.readFileSync(file);
    console.log("First 10 bytes (Hex):", buffer.subarray(0, 10).toString('hex'));
    console.log("First 50 chars (String):", buffer.subarray(0, 50).toString());
} catch (e) { console.error(e.message); }
