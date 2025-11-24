const { Redis } = require("@upstash/redis");

// Initialize Redis client
// It automatically reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from .env
let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    } catch (error) {
        console.warn("Failed to initialize Redis client:", error.message);
    }
} else {
    console.warn("Redis credentials not found. Caching and Rate Limiting will be disabled.");
}

module.exports = redis;
