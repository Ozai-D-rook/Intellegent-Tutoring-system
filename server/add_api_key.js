const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');

const apiKey = "AIzaSyDoFWfwcTIhqvf4OHkRpkksqZWLbJVOzrU";
const keyLine = `AI_API_KEY=${apiKey}`;

try {
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    // Check if key already exists
    if (content.includes('AI_API_KEY=')) {
        // Replace existing
        content = content.replace(/AI_API_KEY=.*/g, keyLine);
        console.log("Updated existing AI_API_KEY.");
    } else {
        // Append new
        content += `\n${keyLine}\n`;
        console.log("Appended new AI_API_KEY.");
    }

    fs.writeFileSync(envPath, content, 'utf8');
    console.log("SUCCESS: .env updated securely.");

} catch (err) {
    console.error("Failed to update .env:", err.message);
}
