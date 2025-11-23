const CryptoJS = require("crypto-js");

// Use a fixed key for simplicity in this context, but in production, this should be an environment variable.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "markify-secret-key-123";

if (!process.env.ENCRYPTION_KEY) {
    console.warn("⚠️  WARNING: Using default ENCRYPTION_KEY. Please set ENCRYPTION_KEY in your .env file.");
}

const encryptResponse = (req, res, next) => {
    const originalJson = res.json;

    // Allow bypassing encryption in development for debugging
    // Send header 'x-bypass-encryption: true' to get raw JSON
    const bypassEncryption =
        (process.env.NODE_ENV !== 'production' && req.headers['x-bypass-encryption']) ||
        req.query.bypass_encryption === 'true';

    res.json = function (body) {
        // If bypass is requested, or response is not success, or body is empty, return original
        if (bypassEncryption || res.statusCode < 200 || res.statusCode >= 300 || !body) {
            return originalJson.call(this, body);
        }

        try {
            const jsonString = JSON.stringify(body);
            const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();

            // Return object with encrypted data
            return originalJson.call(this, { encryptedData: encrypted });
        } catch (error) {
            console.error("Encryption failed:", error);
            // Fallback to original body if encryption fails
            return originalJson.call(this, body);
        }
    };

    next();
};

module.exports = encryptResponse;
