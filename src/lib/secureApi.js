import CryptoJS from "crypto-js";

// Use the same key as the backend
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "markify-secret-key-123";

/**
 * Decrypts the response body if it's encrypted.
 * @param {object} data - The response JSON data.
 * @returns {object} - The decrypted data or original data if not encrypted.
 */
export const decryptResponse = (data) => {
    if (data && data.encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(data.encryptedData, ENCRYPTION_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error("Decryption failed:", error);
            return data;
        }
    }
    return data;
};

/**
 * A wrapper around fetch that automatically decrypts the response.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @returns {Promise<Response>} - The fetch response with a modified .json() method.
 */
export const secureFetch = async (url, options = {}) => {
    const response = await fetch(url, options);

    // Clone the response so we can modify the json method
    const originalJson = response.json.bind(response);

    // Override .json() to handle decryption automatically
    response.json = async () => {
        const data = await originalJson();
        return decryptResponse(data);
    };

    return response;
};
