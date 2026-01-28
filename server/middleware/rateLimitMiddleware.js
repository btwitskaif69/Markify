import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "../db/redis";

let ratelimit;

if (redis) {
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

export const applyRateLimit = async (req) => {
  if (!ratelimit) return null;

  try {
    const identifier = req.ip || "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    const headers = new Headers();
    headers.set("X-RateLimit-Limit", String(limit));
    headers.set("X-RateLimit-Remaining", String(remaining));
    headers.set("X-RateLimit-Reset", String(reset));

    if (!success) {
      return {
        response: NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429, headers }
        ),
      };
    }

    return { headers };
  } catch (error) {
    console.error("Rate limit error:", error);
    return null;
  }
};
