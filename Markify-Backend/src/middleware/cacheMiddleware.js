const redis = require("../db/redis");

/**
 * Cache middleware
 * @param {number} duration - Cache duration in seconds
 */
const cacheMiddleware = (duration = 60) => {
    return async (req, res, next) => {
        // Skip if Redis is not configured
        if (!redis) {
            return next();
        }

        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await redis.get(key);

            if (cachedResponse) {
                // If we found a cache, return it immediately
                // Note: We need to parse it if it was stored as a string
                return res.json(cachedResponse);
            }

            // If not cached, we need to intercept the response
            const originalJson = res.json;

            res.json = function (body) {
                // Restore original json function to avoid infinite loop if called again
                res.json = originalJson;

                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // Store in Redis without awaiting (fire and forget)
                    redis.set(key, body, { ex: duration }).catch((err) => {
                        console.error("Redis cache set error:", err);
                    });
                }

                // Send the response
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            console.error("Redis cache error:", error);
            next();
        }
    };
};

module.exports = cacheMiddleware;
