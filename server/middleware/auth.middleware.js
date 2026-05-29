import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCachedAuthUser } from "../cache/authCache";

const ENV = globalThis.process?.env || {};

const getAuthToken = (headers = {}) => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) return null;
  return authHeader.split(" ")[1];
};

export const requireAuth = async (req) => {
  const token = getAuthToken(req.headers);

  if (!token) {
    return NextResponse.json(
      { message: "Not authorized, no token" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await getCachedAuthUser(decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "Not authorized, user not found" },
        { status: 401 }
      );
    }

    req.user = user;
    return null;
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    // If it's a token validation error, return 401
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return NextResponse.json(
        { message: "Not authorized, token failed" },
        { status: 401 }
      );
    }
    
    // If it's a database connection error (e.g., Prisma can't reach Neon), return 500
    // so the client doesn't forcefully log the user out.
    return NextResponse.json(
      { message: "Internal server error during authentication" },
      { status: 500 }
    );
  }
};

export const requireAdmin = async (req) => {
  if (!req.user || !req.user.isAdmin) {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }

  return null;
};
