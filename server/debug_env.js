require('dotenv').config({ path: '../.env' });

console.log("--- DEBUGGING ENV VARS ---");
console.log("VITE_SUPABASE_URL (Raw):", process.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY (Exists?):", !!process.env.VITE_SUPABASE_ANON_KEY);
console.log("VITE_API_URL:", process.env.VITE_API_URL);

if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL.includes("your_supabase_url")) {
    console.log("ERROR: URL contains placeholder text 'your_supabase_url'");
} else if (!process.env.VITE_SUPABASE_URL) {
    console.log("ERROR: VITE_SUPABASE_URL is MISSING or EMPTY");
} else {
    console.log("SUCCESS: URL format looks okay.");
}
