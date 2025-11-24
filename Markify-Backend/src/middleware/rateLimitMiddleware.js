const { Ratelimit } = require("@upstash/ratelimit");
const redis = require("../db/redis");

let ratelimit;

if (redis) {
    // Create a new ratelimiter, that allows 10 requests per 10 seconds
    ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit",
    });
}

const rateLimitMiddleware = async (req, res, next) => {
    // Skip rate limiting in development if needed, or if Redis is not configured
    if (!ratelimit) {
        return next();
    }

    try {
        // Use IP address as the identifier
        const identifier = req.ip || "127.0.0.1";

        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

        // Set standard rate limit headers
        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader("X-RateLimit-Remaining", remaining);
        res.setHeader("X-RateLimit-Reset", reset);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests. Please try again later.",
            });
        }

        next();
    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open: if Redis is down, allow the request
        next();
    }
};

module.exports = rateLimitMiddleware;
