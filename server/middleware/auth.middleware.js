import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient";
import { isAdminEmail } from "../utils/admin";
import { runWithPrismaRetry } from "../db/prismaRetry";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await runWithPrismaRetry(
      () =>
        prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            geminiUsage: true,
            isSubscribed: true,
            subscriptionEnds: true,
            dodoCustomerId: true,
            dodoSubscriptionId: true,
          },
        }),
      { label: "Auth user lookup" }
    );

    if (!user) {
      return NextResponse.json(
        { message: "Not authorized, user not found" },
        { status: 401 }
      );
    }

    req.user = { ...user, isAdmin: isAdminEmail(user.email) };
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
  if (!req.user || !isAdminEmail(req.user.email)) {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }

  return null;
};
