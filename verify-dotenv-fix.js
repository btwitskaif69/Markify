const path = require('path');
const backendDir = path.join(__dirname, 'Markify-Backend');

console.log('Testing dotenv loading from:', path.join(backendDir, '.env'));
require('dotenv').config({ path: path.join(backendDir, '.env') });

console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY loaded successfully.');
} else {
    console.error('GEMINI_API_KEY FAILED to load.');
}
