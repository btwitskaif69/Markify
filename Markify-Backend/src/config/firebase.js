const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
    if (serviceAccountKey) {
        try {
            // Handle potential single quotes wrapping the JSON in .env
            let cleanKey = serviceAccountKey.trim();
            if (cleanKey.startsWith("'") && cleanKey.endsWith("'")) {
                cleanKey = cleanKey.slice(1, -1);
            }

            const serviceAccount = JSON.parse(cleanKey);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("✅ Firebase Admin Initialized successfully.");
        } catch (error) {
            console.error("❌ Error initializing Firebase Admin:", error.message);
        }
    } else {
        console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing. Google Auth will not work.");
    }
}

module.exports = admin;
