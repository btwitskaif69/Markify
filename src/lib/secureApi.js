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

import { AUTH_TIMEOUT_MS } from "./apiConfig";

/**
 * A wrapper around fetch that automatically decrypts the response.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @returns {Promise<Response>} - The fetch response with a modified .json() method.
 */
export const secureFetch = async (url, options = {}) => {
    const { timeoutMs = AUTH_TIMEOUT_MS, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error("Request timed out")), timeoutMs);

    // If the caller provided their own signal, we need to respect it too.
    // However, chaining signals is complex, so for now we'll just use our controller
    // and if the user passed a signal, we'd ideally listen to it.
    // For simplicity in this fix, we'll assume most calls don't pass a signal or we override it.
    // A better approach for signal chaining:
    if (options.signal) {
        options.signal.addEventListener('abort', () => controller.abort());
    }

    console.log(`[secureFetch] Requesting: ${url} (Timeout: ${timeoutMs}ms)`);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });

        // Clone the response so we can modify the json method
        const originalJson = response.json.bind(response);

        // Override .json() to handle decryption automatically
        response.json = async () => {
            const data = await originalJson();
            return decryptResponse(data);
        };

        return response;
    } finally {
        clearTimeout(timeoutId);
    }
};
