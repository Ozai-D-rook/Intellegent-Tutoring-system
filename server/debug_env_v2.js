const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');

console.log("Checking .env at:", envPath);

try {
    if (!fs.existsSync(envPath)) {
        console.log("ERROR: File does not exist!");
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    console.log("File Size:", content.length, "bytes");

    if (content.length === 0) {
        console.log("ERROR: File is empty.");
        process.exit(1);
    }

    const lines = content.split(/\r?\n/); // Handle both CRLF and LF
    console.log("Total Lines:", lines.length);

    let foundUrl = false;
    let foundKey = false;
    let foundAI = false;

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        if (trimmed.startsWith('VITE_SUPABASE_URL')) {
            foundUrl = true;
            const parts = trimmed.split('=');
            if (parts.length < 2 || !parts[1].trim()) {
                console.log(`LINE ${index + 1} ERROR: VITE_SUPABASE_URL has no value.`);
            } else {
                console.log(`LINE ${index + 1} OK: VITE_SUPABASE_URL found (Length: ${parts[1].trim().length})`);
                if (parts[1].trim().startsWith("your_supabase")) {
                    console.log("  -> WARN: Value starts with 'your_supabase' - Placeholder detected?");
                }
            }
        }

        if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY')) {
            foundKey = true;
            const parts = trimmed.split('=');
            if (parts.length < 2 || !parts[1].trim()) {
                console.log(`LINE ${index + 1} ERROR: VITE_SUPABASE_ANON_KEY has no value.`);
            } else {
                console.log(`LINE ${index + 1} OK: VITE_SUPABASE_ANON_KEY found (Length: ${parts[1].trim().length})`);
            }
        }

        if (trimmed.startsWith('AI_API_KEY')) {
            foundAI = true;
            const parts = trimmed.split('=');
            if (parts.length < 2 || !parts[1].trim()) {
                console.log(`LINE ${index + 1} ERROR: AI_API_KEY has no value.`);
            } else {
                console.log(`LINE ${index + 1} OK: AI_API_KEY found (Length: ${parts[1].trim().length})`);
            }
        }
    });

    if (!foundUrl) console.log("ERROR: VITE_SUPABASE_URL variable not found in file.");
    if (!foundKey) console.log("ERROR: VITE_SUPABASE_ANON_KEY variable not found in file.");
    if (!foundAI) console.log("ERROR: AI_API_KEY variable not found in file.");

} catch (err) {
    console.error("FS Error:", err.message);
}
